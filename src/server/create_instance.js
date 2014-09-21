var getAccountBalance = require('../account_balance')
  , dns = require('./dns')
  , logger = require('../logger')
  , generateSecret = require('../generate_secret')
  , agentCreationQueue = require('../queues').agentCreation

module.exports = function(user, instance, agent, serverSize, done) {
  if (instance.ready)
    return done(new Error('Still Provisioning'));

  instance.agentConfig.provisioning = true;
  instance.save(function (err) {
    console.log(arguments);
    if (err) return done(err);
    else return done();
  });

  return ;

  var subdomain = dns.subdomain(slug, user.username)
  var agentName = subdomain+'-agent'
  instance.agent = {
    name: agentName,
    secret: generateSecret(),
    fqdn: dns.fqdn(agentName),
    ready: false
  }
  instance.size = size
  instance.fqdn = dns.fqdn(subdomain)

  user.update({ instances: instances }, function(err) {
    if (err) done(err);
    else {
      console.log(instance);

      var job = {
        cloudProvider: 'DigitalOcean',
        instance: instance,
        owner: user._id
      }
      logger.info("adding agent creation job ", job)
      agentCreationQueue.add(job)
      done();
    }
  });
}
