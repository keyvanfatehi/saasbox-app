var Promise = require('bluebird')
var moment = require('moment')

module.exports = function(account) {
  return new Promise(function(resolve, reject) {
    if (account.balance <= 0) return resolve(account); // has positive credit
    if (account.isBillingOk()) return resolve(account); // has setup billing info
    var days = account.daysUntilBadStanding;
    if (days > 0 && days <= 7) {
      if (days === 1 || days % 2) {
        // we mod 2 so you don't get an email everyday.
        // you'll only get 4 warning emails
        account.sendImpendingBillingNeglectNotice();
      }
      account.daysUntilBadStanding = --days;
      account.save(function(err, account) {
        if (err) return reject(err);
        resolve(account)
      })
      return resolve(account);
    } else if (account.standing === 'good') {
      account.standing = 'bad'
      account.sendBadStandingEmail();
      account.save(function(err, account) {
        if (err) return reject(err);
        resolve(account)
      })
    }
  });
}

