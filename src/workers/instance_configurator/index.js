var logger = require('../../logger')
  , Instance = require('../../server/models').Instance
  , Promise = require('bluebird')
  , io = require('../../server/socketio')
  , promiseDestroyInstance = require('./promise_destroy_instance')
  , promiseCreateInstance = require('./promise_create_instance')

module.exports = function(queue) {
  queue.process(function(job, done){
    logger.info('received instance configuration job', job.data);

    Instance
    .findByIdAndPopulateAccount(job.data.instance)
    .then(promiseDestroyInstance('soft'))
    .then(promiseCreateInstance)
    .then(function(instance) {
      logger.info('instance was reconfigured and socketio reload push outbound')
      var room = instance.slug+'-'+instance.account.username
      io.to(room).emit(instance.slug+'ProvisioningStateChange', {
        reload: true
      })
    })
    .then(done).catch(done).error(done)
  })

  queue.on('failed', function(job, err){
    logger.error('configurator job failed due to error '+err.message, job.data)
  })
}
