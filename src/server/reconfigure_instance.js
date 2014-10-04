var Queue = require('../queues').instanceConfigurator
  , logger = require('../logger')

module.exports = function(instance, config, done) {
  console.log(config)
  instance.config = config
  instance.save(function (err) {
    if (err) return done(err);
    else {
      var job = {
        instance: instance._id.toString()
      }
      Queue.add(job)
      logger.info('queued instance configurator job', job)
      return done();
    }
  });
}
