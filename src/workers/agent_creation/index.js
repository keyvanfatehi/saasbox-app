var logger = require('../../logger')
  , Instance = require('../../server/models').Instance
  , config = require('../../../etc/config')
  , vps = require('./cloud_providers/digital_ocean')(config.digitalocean)
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

    Instance.findOne({ _id: job.data.instance }).exec(function(err, instance) {
      job.instance = instance
      job.progress(10)
      return instance;
    }).then(function(instance) {
      logger.warn('not done yet')
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
  
  queue.on('progress', function(job, progress){
    job.instance.updateProgress(progress, function(err) {
      if (err) logger.error(err);
      else {
        console.log('emit progress');
        job.instance.room().emit('progress', {
          instance: job.instance._id,
          progress: progress
        })
      }
    })
  })
  
  queue.on('failed', function(job, err){
    logger.error('job failed', err.message, job.data);
  })
}
