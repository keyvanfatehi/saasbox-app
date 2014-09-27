var getAccountBalance = require('../account_balance')
  , dns = require('./dns')
  , logger = require('../logger')
  , generateSecret = require('../generate_secret')
  , Queue = require('../queues').instanceProvisioner

module.exports = function(user, instance, agent, size, region, done) {
  if (agent.provisioning || agent.provisioned || agent.vps) {
    return done(new Error('instance already activated'));
  }

  var subdomain = dns.subdomain(instance.slug, user.username)
  var agentName = subdomain+'-agent'

  instance.cloudProvider = 'DigitalOcean'
  instance.region = region
  instance.size = size
  instance.name = subdomain
  instance.fqdn = dns.fqdn(subdomain)
  instance.agent = {
    provisioning: {
      started: new Date(),
      state: {
        progress: 0
      }
    },
    provisioned: false,
    name: agentName,
    secret: generateSecret(),
    fqdn: dns.fqdn(agentName)
  }

  instance.save(function (err) {
    if (err) return done(err);
    else {
      // add user's socket into the instance.room()
      var job = {
        cloudProvider: instance.cloudProvider,
        instance: instance._id.toString()
      }
      Queue.add(job)
      logger.info('queued instance provisioning job', job)
      return done();
    }
  });
}
