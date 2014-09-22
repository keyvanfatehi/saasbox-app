var logger = require('../../logger')
  , Instance = require('../../server/models').Instance
  , config = require('../../../etc/config')
  , cloudProviders = require('./cloud_providers')
  , dns = require('../../server/dns')
  , create = require('./create')
  , Promise = require('bluebird')

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

    Instance.findOne({ _id: job.data.instance }, function(err, instance) {
      if (err) done(err);
      job.instance = instance
      job.progress({
        progress: 2,
        failed: true,
        error: {
          message: 'message',
          stack: 'stack'
        }
      })
      //var vmApiConfig = config.cloudProviders[job.data.cloudProvider]
      //var vmApi = cloudProviders[job.data.cloudProvider](vmApiConfig)
      //console.log(vmAPI);
      logger.warn('not done yet')
      //done(new Error('restore app to off, push to UI and show in modal'))
    })

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
    if (job.instance) {
      job.instance.updateProvisioningState(newState, function(err) {
        if (err) logger.error(err);
        else {
          var room = job.instance.room()
          logger.info('emitting new state to room '+room.name, newState);
          room.emit('Instance:'+job.instance._id+':ProvisioningStateChange', {
            state: newState
          })
        }
      })
    } else {
      logger.error('could not update state of job due to missing instance', job.data, newState)
    }
  })
  
  queue.on('failed', function(job, err){
    job.progress({
      failed: true,
      error: {
        message: err.message,
        stack: err.stack
      }
    })
  })
}
