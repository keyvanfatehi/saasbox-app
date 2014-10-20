var expect = require('chai').expect
var sinon = require('sinon')
var moment = require('moment')
var mailer = require('../../../src/server/mailer')
var models = require('../../../src/server/models')
var Instance = models.Instance
var Account = models.Account

module.exports = function(account) {
  return {
    "account owes money": function(done) {
      account.balance = 10;
      account.save(done)
    },
    "account cannot pay": function(done) {
      account.stripeCustomerId = account.creditCardInfo = null
      expect(account.isBillingOk()).to.eq(false)
      account.save(done)
    },
    "account billing is ok": function(done) {
      account.stripeCustomerId = account.creditCardInfo = 'ok'
      account.save(done)
    },
    "account is in good standing": function(done) {
      account.standing = 'good';
      account.save(done)
    },
    "account is in bad standing": function(done) {
      account.standing = 'bad';
      account.save(done)
    },
    "account has been unable to pay for 8 days": function(done) {
      account.billingBadSince = moment().subtract(8, 'days')._d
      account.save(done)
    },
    "account has been unable to pay for 3 days": function(done) {
      account.billingBadSince = moment().subtract(3, 'days')._d
      account.save(done)
    },
    "account has been unable to pay for 6 days": function(done) {
      account.billingBadSince = moment().subtract(6, 'days')._d
      account.save(done)
    },
    "account has a 0 balance": function(done) {
      account.balance = 0;
      account.save(done)
    },
    "account has an instance": function(done) {
      var aWeekAgo = moment().subtract(7, 'days')._d
      var yesterday = moment().subtract(24, 'hours')._d
      new models.Instance({
        slug: 'strider',
        size: { cents: 500 }, // $5.00 a month
        turnedOnAt: aWeekAgo,
        balanceMovedAt: yesterday,
        account: account._id,
        agent: { vps: { id: 567 }, fqdn: '234' },
        notes: { url: 'https://...' },
        cloudProvider: 'rax',
        fqdn: '123'
      }).save(done);
    }
  }
}
