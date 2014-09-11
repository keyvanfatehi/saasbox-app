var getAccountBalance = require('../../account_balance')
  , dns = require('../dns')
  , async = require('async')

module.exports = function (req, res, next) {
  var instance = req.user.instance;
  var fqdn = dns.fqdn(dns.subdomain(product, req.user.username))
  if (req.body.status === 'off') {
    req.agent.perform('destroy', instance, function(err, ares) {
      var newBalance = getAccountBalance(req.user);
      instance.turnedOffAt = new Date();
      instance.turnedOnAt = null;
      instance.balanceMovedAt = new Date();
      async.parallel({
        update: function (cb) {
          req.user.update({
            balance: newBalance,
            instance: instance
          }, cb);
        },
        proxy: function (cb) {
          req.agent.destroyProxy(instance.fqdn)
          cb();
        },
        dns: function (cb) {
          dns.deleteRecord(fqdn, cb);
        }
      }, next);
    })
  } else if (req.body.status === 'on') {
    req.agent.perform('install', instance, function(err, ares) {
      instance.turnedOffAt = null;
      instance.turnedOnAt = new Date();
      instance.fqdn = fqdn
      instance.admin = {
        email: ares.body.app.email,
        password: ares.body.app.password
      }
      async.parallel({
        update: function (cb) {
          req.user.update({ instance: instance }, cb);
        },
        proxy: function (cb) {
          req.agent.createProxy(instance.fqdn, ares.body.app.url, cb)
        },
        dns: function (cb) {
          dns.addRecord(fqdn, req.agent.ip, cb);
        }
      }, next);
    })
  } else res.status(422).end()
}
