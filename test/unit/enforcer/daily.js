process.env.NODE_ENV = 'test';
var models = require('../../../src/server/models')
  , expect = require('chai').expect
  , moment = require('moment')
  , dbSupport = require('../../support/db')
  , connectDatabase = dbSupport.connect
  , truncateDatabase = dbSupport.truncate
  , enforcerSupport = require('../../support/enforcer')
  , createAccount = enforcerSupport.createAccount
  , getAccount = enforcerSupport.getAccount
  , afterTick = enforcerSupport.afterTick('daily')
  , storySupport = require('../../support/story')

describe("daily enforcer", function() {
  var story = storySupport(enforcerSupport.loadPreconditions)
  before(connectDatabase)

  beforeEach(function(done) {
    truncateDatabase(function() {
      createAccount(done)
    });
  });

  story([
    "account owes money",
    "account cannot pay",
    "account has been unable to pay for 8 days"
  ], function() {
    it("is put in bad standing", afterTick(function(account) {
      expect(account.standing).to.eq('bad')
    }));
  })

  story([
    "account owes money",
    "account cannot pay",
    "account has been unable to pay for 6 days"
  ], function() {
    it("account is not yet put in bad standing", afterTick(function(account) {
      expect(account.standing).to.eq('good')
    }));
  });

  story([
    "account owes money",
    "account has been unable to pay for 8 days",
    "account billing is ok",
  ], function() {
    it("account is not put in bad standing", afterTick(function(account) {
      expect(account.standing).to.eq('good')
    }));
  });

  story([
    "account has an instance",
    "account has a 0 balance"
  ], function() {

    it("updates balance movement timestamp", afterTick(function(account) {
      var instance = account.instances[0]
      expect(
        moment(instance.balanceMovedAt)
        .isAfter(moment().subtract(1, 'second'))
      ).to.eq(true, 'balance movement timestamp not updated');
    }));

    it("updates account balance", afterTick(function(account) {
      expect(account.balance).to.be.closeTo(125, 1);
    }))
  })

  story([
    "account has an instance",
    "account billing is not ok",
    "account has been unable to pay for 3 days",
    "account is in good standing"
  ], function() {
    it.skip("sends account standing warning email", afterTick(function(account) {
      // assert sent email that this instance will be deleted if billing is not fixed within 4 days
    }))

    it.skip("does not delete the user's instances", afterTick(function(account) {
      
    }));
  });

  story([
    "account has an instance",
    "account billing is not ok",
    "account is in bad standing"
  ], function() {
    it.skip("delete the user's instances", afterTick(function(account) {
      // expect the destroyer function to be called with ...
    }));

    it.skip("sends email notifying that instance was destroyed", function() {
      // assert email
    });
  });
})
