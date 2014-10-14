process.env.NODE_ENV = 'test';
var daily = require('../../../src/enforcer/daily')
var models = require('../../../src/server/models')
var expect = require('chai').expect
var sinon = require('sinon')
var moment = require('moment')
var Promise = require('bluebird')
var mongoose = require('mongoose')
var config = require('../../../etc/config')

mongoose.connect(config.mongodb);
mongoose.connection.on('error', function(err) {
  throw err;
})

describe("daily enforcer", function() {
  var task = null;
  var account = null;
  var instances = null;

  before(function(done) {
    mongoose.connection.on('connected', function() {
      mongoose.connection.db.dropDatabase(function(err) {
        if (err) throw err;
        done()
      })
    })
  })

  beforeEach(function(done) {
    account = new models.Account();
    account.save(function(err, acc) {
      if (err) throw err;
      done();
    });
  });

  var accountPreconditions = {
    "account owes money": function() {
      account.balance = 10;
    },
    "account cannot pay": function() {
      account.isBillingOk = function() {
        return false
      }
    },
    "account can pay": function() {
      account.stripeCustomerId = 'ok';
      account.creditCardInfo = 'ok';
    },
    "account is in good standing": function() {
      account.standing = 'good';
    },
    "account has been unable to pay for 8 days": function() {
      var aWeekAgo = moment().subtract(8, 'days')._d
      account.billingBadSince = aWeekAgo;
    },
    "account has been unable to pay for 6 days": function() {
      var aWeekAgo = moment().subtract(6, 'days')._d
      account.billingBadSince = aWeekAgo;
    }
  }

  var loadPreconditions = function(precon) {
    return function(done) {
      precon.forEach(function(desc) {
        accountPreconditions[desc]()
      })
      account.save(done)
    }
  }

  var afterTick = function(assertions) {
    return function(done) {
      daily.onTick(function(err) {
        if (err) return done(err);
        models.Account.findOne({ _id: account._id.toString() }).exec(function(err, acc) {
          account = acc;
          assertions();
          done(err);
        })
      })
    }
  }

  describe("account owes, has been unable to pay for 8 days, and billing is not ok", function() {
    beforeEach(loadPreconditions([
      "account owes money",
      "account cannot pay",
      "account has been unable to pay for 8 days"
    ]))

    it("account is put in bad standing", afterTick(function() {
      expect(account.standing).to.eq('bad')
    }));
  });

  describe("account owes, has been unable to pay for 6 days, and billing is not ok", function() {
    beforeEach(loadPreconditions([
      "account owes money",
      "account cannot pay",
      "account has been unable to pay for 6 days"
    ]))

    it("account is not yet put in bad standing", afterTick(function() {
      expect(account.standing).to.eq('good')
    }));
  });

  describe("account owes, has been unable to pay for 8 days, but billing is ok", function() {
    beforeEach(loadPreconditions([
      "account owes money",
      "account has been unable to pay for 8 days",
      "account can pay",
    ]))

    it("account is not put in bad standing", afterTick(function() {
      expect(account.standing).to.eq('good')
    }));
  });

  describe("account has an instance that has been on for 24 hours", function() {
    var aWeekAgo = moment().subtract(7, 'days')._d
    var yesterday = moment().subtract(24, 'hours')._d
    var instance = null;

    beforeEach(function(done) {
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

    it("moves balance, updates timestamp, and saves", afterTick(function() {
      expect(account.balance).to.be.closeTo(1150, 1);
      expect(
        moment(instance.balanceMovedAt)
        .isAfter(moment().subtract(1, 'second'))
      ).to.eq(true, 'balance movement timestamp not updated');
    }))
  });
})
