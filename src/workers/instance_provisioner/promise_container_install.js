var Account = require('../../server/models').Account
  , Agent = require('../../server/agent')
  , logger = require('../../logger')

/* Now we need to get a hold of the Agent
 * and tell it to download required images for this product
 * at the current or latest (if no current version is set) tags.
 */
module.exports = function(options) {
  var instance = options.instance;
  var bumpProgress = options.bumpProgress;
  var agent = new Agent(instance.agent);
  return new Promise(function (resolve, reject) {
    agent.perform('install', slug, {
      namespace: user.username,
      fqdn: instance.fqdn
    }, function(err, ares) {
      if (err) return reject(err);
      instance.turnedOffAt = null;
      instance.turnedOnAt = new Date();
      instance.notes = {
        admin: {
          login: ares.body.app.login,
          password: ares.body.app.password
        }
      }
      agent.createProxy(instance.fqdn, ares.body.app.url, function (err) {
        if (err) return reject(err);
        resolve();
      })
    })
  })
}
