var Promise = require('bluebird')
var moment = require('moment')

module.exports = function(account) {
  return new Promise(function(resolve, reject) {
    var aWeekAgo = moment().subtract(7, 'days')
    var billingOk = account.isBillingOk()
    var billingNeglect = moment(account.billingBadSince).isBefore(aWeekAgo)
    if (billingOk) return resolve(account)
    if (!billingNeglect) return resolve(account)
    account.standing = 'bad'
    return account.save(function(err) {
      if (err) return reject(err);
      resolve(account)
    })
  });
}

