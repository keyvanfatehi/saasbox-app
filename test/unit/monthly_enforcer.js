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

describe.skip("monthly enforcer", function() {
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
    sinon.stub(stripe, 'createCharge')
    sinon.stub(mailer, 'sendMail')
  });

  afterEach(function() {
    stripe.createCharge.restore()
    mailer.sendMail.restore()
  });

  story([
    "account owes money"
  ], function() {
    it("charges the card on file", function() {
      expect(stripe.createCharge.callCount).to.eq(1);
    })

    it("updates the balance to 0", function() {
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
