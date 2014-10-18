var Promise = require('bluebird')
var moment = require('moment')
  , mailer = require('../../server/mailer')

module.exports = function(account) {
  return new Promise(function(resolve, reject) {
    var aWeekAgo = moment().subtract(7, 'days')
    var billingOk = account.isBillingOk()
    if (billingOk) return resolve(account);
    var days = account.daysUntilBillingNeglect()
    console.log('!!!', days);
    if (days > 7) {
      account.standing = 'bad'
      console.log(days);
      account.save(function(err, account) {
        if (err) return reject(err);
        resolve(account)
      })
    } else if (days > 0 && days < 7) {
      account.sendImpendingBillingNeglectNotice();
    }
    return resolve(account);
  });
}

