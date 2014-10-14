var daily = require('../../src/enforcer/daily')
var Account = require('../../src/server/models/Account')
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
    
    task = daily(context).onTick

    account = new Account();
    account.save = sinon.stub().yields(null)
    Account.findAsync = function() {
      return new Promise(function(resolve) {
        resolve([account])
      })
    }
  });


  describe("account that cannot pay owes money", function() {

    beforeEach(function() {
      account.balance = 10;
      expect(account.isBillingOk()).to.eq(false)
    })

    describe("account is in good standing", function() {
      beforeEach(function() {
        account.standing = 'good';
      });

      describe("account has been unable to pay for 7 days", function() {
        beforeEach(function() {
          var aWeekAgo = moment().subtract(7, 'days')._d
          account.billingBadSince = aWeekAgo;
        });

        it("account is put in bad standing", function(done) {
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

  });

});

