var config = require('../../../etc/config')
  , product = require('../../../product')
  , getAccountBalance = require('../../account_balance')

module.exports = function (req, res, next) {
  var instance = req.user.instance;
  if (req.body.status === 'off') {
    req.agent.perform('destroy', instance, function(err, ares) {
      var newBalance = getAccountBalance(req.user);
      instance.turnedOffAt = new Date();
      instance.turnedOnAt = null;
      instance.balanceMovedAt = new Date();
      // delete the proxy
      // delete dns subdomain
      req.user.update({
        balance: newBalance,
        instance: instance
      }, function(err) {
        if (err) return next(err);
        req.agent.destroyProxy(instance.fqdn, function(err) {
          if (err) return next(err);
          next()
        });
      });
    })
  } else if (req.body.status === 'on') {
    req.agent.perform('install', instance, function(err, ares) {
      instance.turnedOffAt = null;
      instance.turnedOnAt = new Date();
      instance.fqdn = product.slug+'-'+req.user.username+'.'+req.agent.domain
      req.user.update({ instance: instance }, function(err) {
        if (err) return next(err);
        req.agent.createProxy(instance.fqdn, ares.body.app.url, function(err) {
          if (err) return next(err);
          cloudflare.addRecord('A', instance.fqdn, req.agent.ip, function(err) {
            if (err) return next(err);
            next()
          })
        })
      })
    })
  } else res.status(422).end()
}

// create the proxy
// create dns subdomain
var cloudflare = {
  addRecord: function(type, fqdn, ip, cb) {
    cb()
  }
}
