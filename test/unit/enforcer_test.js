var daily = require('../../src/enforcer/daily')
var Account = require('../../src/server/models/Account')
var expect = require('chai').expect
var sinon = require('sinon')
var moment = require('moment')
var Promise = require('bluebird')

describe("daily enforcer", function() {
  var task = null;
  var context = null;

  beforeEach(function() {
    context = {
      Account: Account,
      logger: {
        info: function(){},
        error: function(){}
      }
    }
    
    task = daily(context).onTick
  });

  describe("dealing with abusive accounts", function() {
    var account = null;

    beforeEach(function() {
      account = new Account();
      account.save = sinon.stub().yields(null)
      account.balance = 10;
      account.standing = 'good';
      expect(account.isBillingOk()).to.eq(false)
      var aWeekAgo = moment().subtract(7, 'days')._d
      account.billingBadSince = aWeekAgo;
      Account.findAsync = function() {
        return new Promise(function(resolve) {
          resolve([account])
        })
      }
    });

    it("puts the account in bad standing", function(done) {
      context.errback = done;
      context.callback = function() {
        expect(account.standing).to.eq('bad')
        expect(account.save.callCount).to.eq(1)
        done();
      }
      task();
    });
  });

});
