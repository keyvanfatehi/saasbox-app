var dns = require('./dns')
  , generateSecret = require('../generate_secret')
  , Promise = require('bluebird')
  , Instance = require('./models').Instance

module.exports = function(user, instance, cloud, size, region, done) {
  instance.size = size
  instance.region = region
  instance.cloudProvider = cloud
  instance.agent.secret = generateSecret()
  var rootSubdomain = dns.subdomain(instance.slug, user.username)
  determineNewInstanceName(rootSubdomain).then(function (name) {
    instance.name = name
    instance.fqdn = dns.fqdn(name)
    instance.agent.name = name+'-agent';
    instance.agent.fqdn = dns.fqdn(instance.agent.name);
    instance.agent.provisioning = {
      queuedAt: new Date(),
      state: {
        progress: 0,
        status: 'queued'
      }
    }
    instance.save(function(err, instance) {
      if (err) return done(err);
      else instance.queueProvisioning();
      done(null, instance);
    });
  }).catch(done).error(done);
}


function determineNewInstanceName(root) {
  return new Promise(function(resolve, reject) {
    Instance.count({name: root }).exec(function(err, count) {
      if (err) return reject(err);
      else if (count === 0) return resolve(root);
      else {
        var tail = Math.random().toString(16).substring(2,5)
        determineNewInstanceName(root+'-'+tail)
        .then(resolve).error(reject).catch(reject)
      }
    })
  })
}
