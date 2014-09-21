var logger = require('../../logger')
  , config = require('../../../etc/config')
  , vps = require('./cloud_providers/digital_ocean')(config.digitalocean)
  , dns = require('../../server/dns')

module.exports = function(Queue) {
  //var out = Queue('agent_creation:message', 6379, '127.0.0.1')

  var queue = Queue('agent_creation:jobs')
  
  queue.process(function(job, done){
    logger.info('Received job from app server: ', job.data);

    //var progress = 0;
    //// do some stuff
    //var interval = setInterval(function() {
    //  progress += 10;
    //  console.log('progress', progress);
    //  job.progress(progress)
    //  if (progress === 100)
    //    clearInterval(interval);
    //}, 1000)

    // you got an ip address, give it back so the dns can start to propagate
    //out.add({
    //  owner: job.data.owner,
    //  slug: job.data.slug,
    //  ip: '127.0.0.1',
    //  status: 'got ip'
    //})

    // now kick off ansible, start sending me status updates about it
    done();
  })
  
  queue.on('failed', function(job, err){
    logger.error('job failed', err.message);
  }).on('progress', function(job, progress){
    logger.info('progress', progress);
  })
}
