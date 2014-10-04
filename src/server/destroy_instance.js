var getAccountBalance = require('../account_balance')
  , async = require('async')
  , dns = require('./dns')

module.exports = function(user, agent, slug, done) {
  return done(new Error('501'))
  var instances = user.instances;
  var instance = user.instances[slug];
  var fqdn = dns.fqdn(dns.subdomain(slug, user.username))
  agent.perform('destroy', slug, {
    namespace: user.username
  }, function(err, ares) {
    var newBalance = getAccountBalance(user, slug, instance);
    instance.turnedOffAt = new Date();
    instance.turnedOnAt = null;
    instance.balanceMovedAt = new Date();
    async.parallel({
      update: function (cb) {
        user.update({
          balance: newBalance,
          instances: instances
        }, cb);
      },
      proxy: function (cb) {
        agent.destroyProxy(instance.fqdn)
        cb();
      },
      dns: function (cb) {
        dns.deleteRecord(fqdn, cb);
      }
    }, done);
  })
}
