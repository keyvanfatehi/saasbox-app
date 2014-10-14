var Promise = require('bluebird')

module.exports = function(items) {
  var account = items.account;
  var instance = items.instance;
  return new Promise(function(resolve, reject) {
    if (account.standing === 'bad') {
      instance.selfDestruct();
    }
    resolve(instance)
  });
}
