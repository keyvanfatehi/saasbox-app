var getAccountBalance = require('../account_balance')
  , async = require('async')
  , dns = require('./dns')
  , logger = require('../logger')
  , generateSecret = require('../generate_secret')
  , agentCreationQueue = require('../queues').agentCreation

/* spin up new vm on digitalocean
 * get vm ip
 * create dns entry
 * provision with ansible (NAME=foo mkagent)
 * provision with ydm
 * callback each step to web app, storing agent secret, etc
 * push each step to UI over websocket
 */

module.exports = function(user, agent, slug, size, done) {
  var instances = user.instances;
  var instance = user.instances[slug];
  if (instance.ready)
    return done(new Error('Still Provisioning'));
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
      agentCreationQueue.add({
        cloudProvider: 'DigitalOcean',
        instance: instance,
        slug: slug,
        owner: user._id
      });
      done();
    }
  });
}
