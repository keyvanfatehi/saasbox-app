var Promise = require('bluebird')
var fn = require('require-directory')(module)

module.exports = function(account) {
  return new Promise(function(resolve, reject) {
    var done = function() { resolve(account) }
    if (account.instances.length === 0) return done();
    Promise.map(account.instances, function(instance) {
      return {
        account: account,
        instance: instance
      }
    })
    .map(fn.moveBalance)
    .map(fn.destroyExpired)
    .then(done).error(reject).catch(reject)
  })
}

