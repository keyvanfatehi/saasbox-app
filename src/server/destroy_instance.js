var getAccountBalance = require('../account_balance')
  , async = require('async')
  , dns = require('./dns')

module.exports = function(user, instance, agent, done) {
  var newBalance = getAccountBalance(user, instance);
  async.parallel({
    removeContainers: function(cb) {
      console.log('removing containers')
      agent.perform('destroy', instance.slug, {
        namespace: instance.name
      }, cb)
    },
    updateInstance: function(cb) {
      console.log('updating instance');
      instance.setTurnedOffNow();
      instance.balanceMovedAt = new Date();
      instance.save(cb)
    },
    updateAccountBalance: function (cb) {
      console.log('updating account balance to ', newBalance);
      user.update({ balance: newBalance }, cb);
    },
    removeProxyTarget: function (cb) {
      console.log('destroying proxy')
      agent.destroyProxy(instance.fqdn, cb)
    },
    removeDnsRecord: function (cb) {
      console.log('deleting dns record')
      dns.deleteRecord(instance.fqdn, cb);
    }
  }, done);
}
