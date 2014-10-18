var Promise = require('bluebird')
var moment = require('moment')
  , mailer = require('../../server/mailer')

module.exports = function(account) {
  return new Promise(function(resolve, reject) {
    var aWeekAgo = moment().subtract(7, 'days')
    var billingOk = account.isBillingOk()
    if (billingOk) return resolve(account);
    var billingNeglect = moment(account.billingBadSince).isBefore(aWeekAgo)
    if (billingNeglect) {
      account.standing = 'bad'
      return resolve(account.saveAsync())
    } else {
      var days = account.daysUntilBillingNeglect()
      if (days > 0 || days < 7) {
        account.sendImpendingBillingNeglectNotice();
      }
    }
    return resolve(account);
  });
}

