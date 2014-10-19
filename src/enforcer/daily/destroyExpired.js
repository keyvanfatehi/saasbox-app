var Promise = require('bluebird')

module.exports = function(items) {
  var account = items.account;
  var instance = items.instance;
  return new Promise(function(resolve, reject) {
    if (account.standing === 'bad') {
      instance.selfDestruct(function(err) {
        if (err) return reject(err);
        resolve(instance)
      });
    } else {
      resolve(instance)
    }
  });
}
