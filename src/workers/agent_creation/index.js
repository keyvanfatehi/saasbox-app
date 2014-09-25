var logger = require('../../logger')
  , Instance = require('../../server/models').Instance
  , promiseDNS = require('./promise_dns')
  , Promise = require('bluebird')
  , io = require('../../server/socketio')
  , promiseVPS = require('./promise_vps')
  , simpleStacktrace = require('../../simple_stacktrace')
  , blockUntilListening = require('./block_until_listening')

/* spin up new vm on digitalocean with the correct public key
 * get vm ip
 * create dns entry
 * provision with ansible
 * callback each step to web app, storing agent secret, etc
 * push each step to UI over websocket
 */

module.exports = function(queue) {
  queue.process(function(job, done){
    logger.info('received agent creation job', job.data);
    var init = function(instance) {
      logger.info('provisioning instance', instance._id.toString())
      job.instance = instance
      job.progress({ progress: 1 })
      return instance
    }
    Instance
    .findByIdAndPopulateAccount(job.data.instance)
    .then(init)
    .then(promiseVPS)
    .then(function(ip) {
      job.progress({ progress: 10 })
      logger.info('vps ip:', ip);
      promiseDNS({ fqdn: job.instance.agent.fqdn, ip: ip })
      promiseDNS({ fqdn: job.instance.fqdn, ip: ip })
      // let them resolve async, we'll ensure they have at the end.
      return blockUntilListening({ port: 22, ip: ip, match: "SSH" })
    })
    .then(function(ip) {
      job.progress({ progress: 20 })
      logger.info('SSH connection now possible, IP:', ip)

      // when done, set agent.provisioned to new Date();
      // now kick off ansible, start sending me status updates about it
    })
    .catch(done)
    .error(done) // todo destroy the VPS in case of errors
  })
  
  queue.on('progress', function(job, newState){
    newState.status = 'provisioning'
    if (job.instance) {
      job.instance.updateProvisioningState(newState, function(err) {
        if (err) logger.error(err);
        else {
          var room = job.instance.slug+'-'+job.instance.account.username
          io.to(room).emit(job.instance.slug+'ProvisioningStateChange', {
            state: newState
          })
        }
      })
    } else {
      logger.error('could not update state of job due to missing instance', job.data, newState)
    }
  })
  
  queue.on('failed', function(job, err){
    logger.error('job failed due to error '+err.message, job.data)
    job.progress({
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
