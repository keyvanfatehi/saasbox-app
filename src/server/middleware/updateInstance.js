var product = require('../../../product')
  , getAccountBalance = require('../../account_balance')
  , dns = require('../dns')

function subdomain(product, user) {
  return product.slug+'-'+user.username
}

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
        req.agent.destroyProxy(instance.fqdn, function(err) {
          if (err) return next(err);
          var sub = subdomain(product, req.user)
          dns.deleteRecord(sub, next)
        });
      });
    })
  } else if (req.body.status === 'on') {
    req.agent.perform('install', instance, function(err, ares) {
      instance.turnedOffAt = null;
      instance.turnedOnAt = new Date();
      var sub = subdomain(product, req.user)
      instance.fqdn = dns.fqdn(sub)
      req.user.update({ instance: instance }, function(err) {
        if (err) return next(err);
        req.agent.createProxy(instance.fqdn, ares.body.app.url, function(err) {
          if (err) return next(err);
          dns.addRecord(sub, req.agent.ip, next)
        })
      })
    })
  } else res.status(422).end()
}

