var getAccountBalance = require('../account_balance')
  , dns = require('./dns')
  , logger = require('../logger')
  , generateSecret = require('../generate_secret')
  , agentCreationQueue = require('../queues').agentCreation
//  , io = require('src/server/socketio')

module.exports = function(user, instance, agent, size, done) {
  if (agent.provisioning || agent.provisioned) {
    return done(new Error('instance already activated'));
  }

  var subdomain = dns.subdomain(instance.slug, user.username)
  var agentName = subdomain+'-agent'

  instance.size = size
  instance.fqdn = dns.fqdn(subdomain)
  instance.agent = {
    provisioning: {
      started: new Date(),
      progress: 0
    },
    name: agentName,
    secret: generateSecret(),
    fqdn: dns.fqdn(agentName)
  }

  instance.save(function (err) {
    if (err) return done(err);
    else {
      // add user's socket into the instance.room()
      var job = {
        cloudProvider: 'DigitalOcean',
        instance: instance._id.toString()
      }
      agentCreationQueue.add(job)
      logger.info('queued agent creation job', job)
      return done();
    }
  });
}
