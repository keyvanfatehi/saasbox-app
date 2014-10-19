var Promise = require('bluebird')
var moment = require('moment')

module.exports = function(account) {
  return new Promise(function(resolve, reject) {
    if (account.balance <= 0) return resolve(account)
    var aWeekAgo = moment().subtract(7, 'days')
    var billingOk = account.isBillingOk()
    if (billingOk) return resolve(account);
    var days = account.daysUntilBillingNeglect()
    if (days > 0 && days <= 7) {
      account.sendImpendingBillingNeglectNotice();
      return resolve(account);
    } else {
      account.standing = 'bad'
      account.save(function(err, account) {
        if (err) return reject(err);
        resolve(account)
      })
    }
  });
}

