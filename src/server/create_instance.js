var getAccountBalance = require('../account_balance')
  , async = require('async')
  , dns = require('./dns')

module.exports = function(user, agent, slug, done) {
  var instances = user.instances;
  var instance = user.instances[slug];
  var fqdn = dns.fqdn(dns.subdomain(slug, user.username))
  agent.perform('install', slug, {
    namespace: user.username,
    fqdn: fqdn
  }, function(err, ares) {
    if (err) return done(err);
    instance.turnedOffAt = null;
    instance.turnedOnAt = new Date();
    instance.fqdn = fqdn
    instance.notes = {
      admin: {
        login: ares.body.app.login,
        password: ares.body.app.password
      }
    }
    async.parallel({
      update: function (cb) {
        user.update({ instances: instances }, cb);
      },
      proxy: function (cb) {
        agent.createProxy(instance.fqdn, ares.body.app.url, cb)
      },
      dns: function (cb) {
        dns.addRecord(fqdn, agent.ip, cb);
      }
    }, done);
  })
}
