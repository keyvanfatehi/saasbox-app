var getAccountBalance = require('../../account_balance')
  , dns = require('../dns')

module.exports = function (req, res, next) {
  var instance = req.user.instance;
  if (req.body.status === 'off') {
    req.agent.perform('destroy', instance, function(err, ares) {
      var newBalance = getAccountBalance(req.user);
      instance.turnedOffAt = new Date();
      instance.turnedOnAt = null;
      instance.balanceMovedAt = new Date();
      req.user.update({
        balance: newBalance,
        instance: instance
      }, function(err) {
        if (err) return next(err);
        req.agent.destroyProxy(instance.fqdn)
        next()
      });
    })
  } else if (req.body.status === 'on') {
    req.agent.perform('install', instance, function(err, ares) {
      instance.turnedOffAt = null;
      instance.turnedOnAt = new Date();
      instance.fqdn = dns.fqdn(dns.subdomain(req.user.username))
      instance.admin = {
        email: ares.body.app.email,
        password: ares.body.app.password
      }
      req.user.update({ instance: instance }, function(err) {
        if (err) return next(err);
        req.agent.createProxy(instance.fqdn, ares.body.app.url, next)
      })
    })
  } else res.status(422).end()
}
