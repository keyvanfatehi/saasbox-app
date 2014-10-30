process.env.NODE_ENV = 'test';
var models = require('../../src/server/models')
  , chai = require('chai')
  , expect = chai.expect
  , moment = require('moment')
  , sinon = require('sinon')
  , setupDB = require('../support/db').setup
  , enforcerSupport = require('../support/enforcer')
  , storySupport = require('../support/story')
  , mailer = require('../../src/server/mailer')
  , Queues = require('../../src/queues')
  , stripe = require('../../src/server/billing/stripe')

chai.use(require('sinon-chai'))

describe("monthly enforcer", function() {
  var account = null;
  var story = storySupport({
    getContext: enforcerSupport.getContext,
    getSteps: enforcerSupport.steps,
    beforeAssertions: function() {
      beforeEach(function(done) {
        enforcerSupport.tick('monthly', function(err, _account) {
          account = _account
          done();
        })
      });
    }
  })

  beforeEach(function(done) {
    setupDB(function() {
      enforcerSupport.createAccount(done)
    })
  });

  beforeEach(function() {
    sinon.stub(stripe, 'createCharge').returns({})
    sinon.stub(mailer, 'sendMail')
  });

  afterEach(function() {
    stripe.createCharge.restore()
    mailer.sendMail.restore()
  });

  story([
    "account owes money",
    "account is in bad standing"
  ], function() {

    it("charges the customer with his balance", function() {
      expect(stripe.createCharge.callCount).to.eq(1);
      var args = stripe.createCharge.getCall(0).args;
      expect(args[0]).to.eq(10)
      expect(args[1]).to.eq('stripeId')
    })

    it("account should be in good standing", function() {
      expect(account.standing).to.eq('good')
    });

    it("account should have a 0 balance", function() {
      expect(account.balance).to.eq(0)
    })
  })

  story([
    "account does not owe any money"
  ], function() {
    it("does not charge the card on file", function() {
      expect(stripe.createCharge.callCount).to.eq(0);
    })
  })
})
