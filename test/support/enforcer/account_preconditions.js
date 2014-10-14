var expect = require('chai').expect
var moment = require('moment')

module.exports = function(account) {
  var models = require('../../../src/server/models');
  var Instance = models.Instance;
  var Account = models.Account;
  return {
    "account owes money": function() {
      account.balance = 10;
    },
    "account cannot pay": function() {
      expect(account.isBillingOk()).to.eq(false)
    },
    "account billing is ok": function() {
      account.stripeCustomerId = account.creditCardInfo = 'ok'
    },
    "account billing is not ok": function() {
      account.stripeCustomerId = account.creditCardInfo = null
    },
    "account is in good standing": function() {
      account.standing = 'good';
    },
    "account is in bad standing": function() {
      account.standing = 'bad';
    },
    "account has been unable to pay for 8 days": function() {
      account.billingBadSince = moment().subtract(8, 'days')._d
    },
    "account has been unable to pay for 3 days": function() {
      account.billingBadSince = moment().subtract(3, 'days')._d
    },
    "account has been unable to pay for 6 days": function() {
      account.billingBadSince = moment().subtract(6, 'days')._d
    },
    "account has a 0 balance": function() {
      account.balance = 0;
    },
    "account has an instance": function(done) {
      var aWeekAgo = moment().subtract(7, 'days')._d
      var yesterday = moment().subtract(24, 'hours')._d
      new models.Instance({
        size: { cents: 500 }, // $5.00 a month
        turnedOnAt: aWeekAgo,
        balanceMovedAt: yesterday,
        account: account._id
      }).save(done);
    }
  }
}
