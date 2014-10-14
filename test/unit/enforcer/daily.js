process.env.NODE_ENV = 'test';
var models = require('../../../src/server/models')
  , expect = require('chai').expect
  , moment = require('moment')
  , dbSupport = require('../../support/db')
  , connectDatabase = dbSupport.connect
  , truncateDatabase = dbSupport.truncate
  , enforcerSupport = require('../../support/enforcer')
  , loadPreconditions = enforcerSupport.loadPreconditions
  , createAccount = enforcerSupport.createAccount
  , getAccount = enforcerSupport.getAccount
  , afterTick = enforcerSupport.afterTick('daily')

describe("daily enforcer", function() {
  before(connectDatabase)

  beforeEach(function(done) {
    truncateDatabase(function() {
      createAccount(done)
    });
  });

  describe("account owes, has been unable to pay for 8 days, and billing is not ok", function() {
    beforeEach(loadPreconditions([
      "account owes money",
      "account cannot pay",
      "account has been unable to pay for 8 days"
    ]))

    it("account is put in bad standing", afterTick(function(account) {
      expect(account.standing).to.eq('bad')
    }));
  });

  describe("account owes, has been unable to pay for 6 days, and billing is not ok", function() {
    beforeEach(loadPreconditions([
      "account owes money",
      "account cannot pay",
      "account has been unable to pay for 6 days"
    ]))

    it("account is not yet put in bad standing", afterTick(function(account) {
      expect(account.standing).to.eq('good')
    }));
  });

  describe("account owes, has been unable to pay for 8 days, but billing is ok", function() {
    beforeEach(loadPreconditions([
      "account owes money",
      "account has been unable to pay for 8 days",
      "account billing is ok",
    ]))

    it("account is not put in bad standing", afterTick(function(account) {
      expect(account.standing).to.eq('good')
    }));
  });

  describe("account has an instance that has been on for 24 hours", function() {
    var aWeekAgo = moment().subtract(7, 'days')._d
    var yesterday = moment().subtract(24, 'hours')._d
    var account = null;
    var instance = null;

    beforeEach(function(done) {
      account = getAccount()
      instance = new models.Instance({
        size: { cents: 4999 },
        turnedOnAt: aWeekAgo,
        balanceMovedAt: yesterday,
        account: account._id
      })
      instance.save(function(err) {
        if (err) throw err;
        account.balance = 0;
        account.save(done)
      });
    });

    it("moves balance, updates timestamp, and saves", afterTick(function(account) {
      expect(account.balance).to.be.closeTo(1150, 1);
      expect(
        moment(instance.balanceMovedAt)
        .isAfter(moment().subtract(1, 'second'))
      ).to.eq(true, 'balance movement timestamp not updated');
    }))
  });
})
