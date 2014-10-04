var logger = require('../../logger')
  , Instance = require('../../server/models').Instance
  , Promise = require('bluebird')
  , io = require('../../server/socketio')

module.exports = function(queue) {
  queue.process(function(job, done){
    logger.info('received instance configuration job', job.data);

    Instance
    .findByIdAndPopulateAccount(job.data.instance)
    .then(function(instance) {
      console.log('heres the config we need to apply remotely', instance.config)
      
      //done()
    }).catch(done).error(done)
  })

  queue.on('failed', function(job, err){
    logger.error('configurator job failed due to error '+err.message, job.data)
  })
}
