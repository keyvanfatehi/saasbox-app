var getAccountBalance = require('../../account_balance')
var Promise = require('bluebird')

module.exports = function(items) {
  var account = items.account;
  var instance = items.instance;
  return new Promise(function(resolve, reject) {
    account.balance = getAccountBalance(account, instance)
    account.save(function(err) {
      if (err) return reject(err);
      instance.balance = 0;
      instance.balanceMovedAt = new Date();
      instance.save(function(err) {
        if (err) return reject(err);
        resolve(instance)
      })
    })
  });
}
