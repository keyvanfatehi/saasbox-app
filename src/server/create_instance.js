var getAccountBalance = require('../account_balance')
  , async = require('async')
  , dns = require('./dns')

/* spin up new vm on digitalocean
 * get vm ip
 * create dns entry
 * provision with ansible (NAME=foo mkagent)
 * provision with ydm
 * callback each step to web app, storing agent secret, etc
 * push each step to UI over websocket
 */

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
