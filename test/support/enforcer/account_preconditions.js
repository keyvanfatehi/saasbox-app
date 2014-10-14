var expect = require('chai').expect
var moment = require('moment')

module.exports = function(account) {
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
    "account is in good standing": function() {
      account.standing = 'good';
    },
    "account has been unable to pay for 8 days": function() {
      account.billingBadSince = moment().subtract(8, 'days')._d
    },
    "account has been unable to pay for 6 days": function() {
      account.billingBadSince = moment().subtract(6, 'days')._d
    }
  }
}
