var getAccountBalance = require('../../account_balance')
  , dns = require('../dns')
  , async = require('async')

module.exports = function (req, res, next) {
  var slug = req.params.slug;
  var instances = req.user.instances;
  var instance = req.user.instances[slug];
  var fqdn = dns.fqdn(dns.subdomain(slug, req.user.username))
  if (req.body.status === 'off') {
    req.agent.perform('destroy', slug, {
      namespace: req.user.username
    }, function(err, ares) {
      var newBalance = getAccountBalance(req.user, slug, instance);
      instance.turnedOffAt = new Date();
      instance.turnedOnAt = null;
      instance.balanceMovedAt = new Date();
      async.parallel({
        update: function (cb) {
          req.user.update({
            balance: newBalance,
            instances: instances
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
    req.agent.perform('install', slug, {
      namespace: req.user.username,
      fqdn: fqdn
    }, function(err, ares) {
      instance.turnedOffAt = null;
      instance.turnedOnAt = new Date();
      instance.fqdn = fqdn
      instance.notes = {
        admin: {
          login: ares.body.app.email,
          password: ares.body.app.password
        }
      }
      async.parallel({
        update: function (cb) {
          req.user.update({ instances: instances }, cb);
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
