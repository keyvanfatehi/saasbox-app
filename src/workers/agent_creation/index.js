var logger = require('../../logger')
  , Instance = require('../../server/models').Instance
  , dns = require('../../server/dns')
  , Promise = require('bluebird')
  , io = require('../../server/socketio')
  , promiseVps = require('./promise_vps')
  , simpleStacktrace = require('../../simple_stacktrace')

/* spin up new vm on digitalocean with the correct public key
 * get vm ip
 * create dns entry
 * provision with ansible
 * callback each step to web app, storing agent secret, etc
 * push each step to UI over websocket
 */

module.exports = function(queue) {
  queue.process(function(job, done){
    var progress = null;
    logger.info('received agent creation job', job.data);
    Instance.findOne({ _id: job.data.instance }).populate('account').exec(function(err, instance) {
      if (err) done(err);
      new Promise(function(resolve, reject) {
        job.instance = instance
        progress = function(val) { job.progress({ progress: val }) }
        progress(1)
        resolve(instance)
      }).then(promiseVps(job, progress)).then(function(vps) {
        console.log('got vps', vps, 'got an ip address', vps.ip)
        progress(42)
        // Create DNS Entry
        // Provision with Ansible
        throw new Error('end of the line')
      }).catch(done).error(done)
    }, done)

    // you got an ip address, persist and publish over socket.io, enter next phase
    //out.add({
    //  owner: job.data.owner,
    //  slug: job.data.slug,
    //  ip: '127.0.0.1',
    //  status: 'got ip'
    //})

    // when done, set agent.provisioned to new Date();

    // now kick off ansible, start sending me status updates about it
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
        stack: simpleStacktrace(err.stack)
      }
    })
  })
}
