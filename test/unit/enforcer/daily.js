var daily = require('../../../src/enforcer/daily')
var Account = require('../../../src/server/models/Account')
var expect = require('chai').expect
var sinon = require('sinon')
var moment = require('moment')
var Promise = require('bluebird')

describe("daily enforcer", function() {
  var task = null;
  var context = null;
  var account = null;

  beforeEach(function() {
    context = {
      Account: Account,
      logger: {
        info: function(){},
        error: function(){}
      }
    }

    account = new Account();
    account.save = sinon.stub().yields(null)
    Account.findAsync = function() {
      return new Promise(function(resolve) {
        resolve([account])
      })
    }
  });

  var accountPreconditions = {
    "account owes money": function() {
      account.balance = 10;
    },
    "account cannot pay": function() {
      expect(account.isBillingOk()).to.eq(false)
    },
    "account is in good standing": function() {
      account.standing = 'good';
    },
    "account has been unable to pay for 7 days": function() {
      var aWeekAgo = moment().subtract(7, 'days')._d
      account.billingBadSince = aWeekAgo;
    },
    "account has been unable to pay for 6 days": function() {
      var aWeekAgo = moment().subtract(6, 'days')._d
      account.billingBadSince = aWeekAgo;
    }
  }

  var loadPreconditions = function(precon) {
    return function() {
      precon.forEach(function(desc) {
        accountPreconditions[desc]()
      })
    }
  }

  var afterTick = function(cb) {
    return function(done) {
      context.errback = done;
      context.callback = function() {
        cb();
        done();
      }
      daily(context).onTick()
    }
  }

  describe("account has an unpaid balance and billing has not been ok for 7 days", function() {
    beforeEach(loadPreconditions([
      "account owes money",
      "account cannot pay",
      "account is in good standing",
      "account has been unable to pay for 7 days"
    ]))

    it("account is put in bad standing", afterTick(function() {
      expect(account.standing).to.eq('bad')
      expect(account.save.callCount).to.eq(1)
    }));
  });

  describe("account has an unpaid balance and billing has not been ok for 6 days", function() {
    beforeEach(loadPreconditions([
      "account owes money",
      "account cannot pay",
      "account is in good standing",
      "account has been unable to pay for 6 days"
    ]))

    it("account is not yet put in bad standing", afterTick(function() {
      expect(account.standing).to.eq('good')
      expect(account.save.callCount).to.eq(0)
    }));
  });
})
