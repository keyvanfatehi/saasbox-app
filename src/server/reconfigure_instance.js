var Queue = require('../queues').instanceConfigurator
  , logger = require('../logger')

module.exports = function(instance, config, done) {
  instance.config = config
  instance.save(function (err) {
    if (err) return done(err);
    else {
      Queue.add({ instance: instance._id.toString() })
      return done();
    }
  });
}
