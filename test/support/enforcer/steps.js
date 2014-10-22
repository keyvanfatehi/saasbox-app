var expect = require('chai').expect
var sinon = require('sinon')
var moment = require('moment')
var mailer = require('../../../src/server/mailer')
var models = require('../../../src/server/models')
var priceMatrix = require('../../../etc/price_matrix')
var Instance = models.Instance
var Account = models.Account

module.exports = function(account) {
  return {
    "account owes money": function(done) {
      account.balance = 10;
      account.save(done)
    },
    "account does not owe any money": function(done) {
      account.balance = 0;
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
      account.daysUntilBadStanding = -1
      account.save(done)
    },
    "account has been unable to pay for 3 days": function(done) {
      account.daysUntilBadStanding = 4
      account.save(done)
    },
    "account has been unable to pay for 4 days": function(done) {
      account.daysUntilBadStanding = 3
      account.save(done)
    },
    "account has been unable to pay for 6 days": function(done) {
      account.daysUntilBadStanding = 1
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
        size: priceMatrix.Alpha,
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
