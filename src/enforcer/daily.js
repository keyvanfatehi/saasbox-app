/* daily task
  - go through each account
    - has an unpaid balance and billing has been not ok 7 days or more
      - flag standing = 'bad'
    - go through each instance
      - move instance balance into account balance
      - if billing not ok
        - if good account standing
          - send email that this instance will be deleted if billing is not fixed within X days
        - if bad standing
          - delete instance
          - email that the instance has been destroyed
      - (later) if using too much resources, suggest upgrade unless already suggested
*/


var getAccountBalance = require('../account_balance')

var moment = require('moment')

var Promise = require('bluebird')
module.exports = function(context) {
  return {
    cronTime: '00 30 02 * * *',
    humanTime: 'everyday at 02:30:00 AM',
    onTick: function() {
      context.models.Account
      .findAllAndPopulateInstances({})
      .map(evaluateStanding)
      .map(evaluateInstances)
      .then(context.callback)
      .error(context.errback)
      .catch(context.errback)
    }
  }
}


var evaluateStanding = function(account) {
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

var evaluateInstances = function(account) {
  return new Promise(function(resolve, reject) {
    if (account.instances.length === 0)
      return resolve(account);
    Promise.map(account.instances, function(instance) {
      return moveBalance(account, instance)
      .then(destroyDelinquent)
      .then(function() {
        resolve(account)
      })
      .error(reject).catch(reject)
    })
  })
}


var moveBalance = function(account, instance) {
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

var destroyDelinquent = function(instance) {
  return new Promise(function(resolve, reject) {
    resolve(instance)
  });
}
