var getAccountBalance = require('../account_balance')
  , vpsRemoverQueue = require('../queues').vpsRemover

module.exports = function(user, instance, agent, done) {
  user.update({
    balance: getAccountBalance(user, instance)
  }, function(err) {
    if (err) {
      logger.error(err.stack);
      return done(err);
    } else {
      instance.remove(function(err) {
        if (err) return done(err);
        vpsRemoverQueue.add({
          cloudProvider: instance.cloudProvider,
          dnsRecords: [ instance.agent.fqdn, instance.fqdn ],
          vps: instance.agent.vps.id
        })
        instance.agent = {};
        instance.socketEmit({ destroyed: true })
        done();
      })
    }
  });
}
