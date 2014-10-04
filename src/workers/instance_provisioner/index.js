var logger = require('../../logger')
  , Instance = require('../../server/models').Instance
  , promiseDNS = require('./promise_dns')
  , Promise = require('bluebird')
  , io = require('../../server/socketio')
  , promiseVPS = require('./promise_vps')
  , simpleStacktrace = require('../../simple_stacktrace')
  , blockUntilListening = require('./block_until_listening')
  , blockUntilResolving = require('./block_until_resolving')
  , ansible = require('../../ansible')
  , promiseContainerSetup = require('./promise_container_setup')

module.exports = function(queue) {
  queue.process(function(job, done){
    logger.info('received instance provisioning job', job.data);

    var progressBumper = function(current, max) {
      return function() {
        if (current < max) {
          current += 1;
          job.progress(current)
        }
      }
    }

    Instance
    .findByIdAndPopulateAccount(job.data.instance)
    .then(function(instance) {
      logger.info('provisioning instance', instance._id.toString())
      job.error = null;
      job.failed = null;
      job.instance = instance
      job.progress(1)
      return instance;
    })
    .then(promiseVPS({
      onDelayed: {
        time: 10000,
        action: function(explanation) {
          updateProvisioningState(job.instance, {
            progress: 1,
            delayReason: explanation
          })
        }
      }
    }))
    .then(function(ip) {
      job.progress(2)
      logger.info('vps ip:', ip);
      promiseDNS({ fqdn: job.instance.agent.fqdn, ip: ip })
      promiseDNS({ fqdn: job.instance.fqdn, ip: ip })
      return blockUntilListening({
        port: 22,
        ip: ip,
        match: "SSH",
        bumpProgress: progressBumper(3, 25)
      })
    })
    .then(function(ip) {
      job.progress(25)
      logger.info('SSH connection now possible, IP:', ip)
      return ansible.promiseAgentPlaybook({
        instance: job.instance,
        bumpProgress: progressBumper(25, 70)
      })
    }).then(function() {
      job.progress(70)
      return promiseContainerSetup({
        instance: job.instance,
        bumpProgress: progressBumper(70, 99)
      })
    }).then(function(containerNotes) {
      gracefullyExitProvisioningState(job.instance, done)
    }).catch(done).error(done)
  })

  queue.on('progress', function(job, progress){
    if (job.instance) {
      updateProvisioningState(job.instance, {
        delayReason: null,
        progress: progress
      })
    } else {
      logger.error('could not update state of job due to missing instance', job.data, newState)
    }
  })
  
  queue.on('failed', function(job, err){
    logger.error('provisioner job failed due to error '+err.message, job.data)
    updateProvisioningState(job.instance, {
      failed: true,
      error: {
        message: err.message,
        stack: (
          process.env.NODE_ENV === 'production' ?
          simpleStacktrace(err.stack) : err.stack
        )
      }
    })
  })
}


function updateProvisioningState(instance, newState) {
  if (!instance.agent.provisioning) return; // noop for discrete updates
  newState.status = 'provisioning'
  instance.updateProvisioningState(newState, function(err) {
    if (err) logger.error('update provisioning state error '+err.message);
    var room = instance.slug+'-'+instance.account.username
    io.to(room).emit(instance.slug+'ProvisioningStateChange', {
      state: newState
    })
  })
}

function gracefullyExitProvisioningState(instance, done) {
  instance.agent.provisioning = null;
  instance.update({ agent: instance.agent }, function (err) {
    if (err) logger.error('update provisioning state error '+err.message);
    var room = instance.slug+'-'+instance.account.username
    io.to(room).emit(instance.slug+'ProvisioningStateChange', {
      reload: true
    })
    done();
  })
}
