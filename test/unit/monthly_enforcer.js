process.env.NODE_ENV = 'test';
var models = require('../../src/server/models')
  , chai = require('chai')
  , expect = chai.expect
  , moment = require('moment')
  , sinon = require('sinon')
  , setupDB = require('../support/db').setup
  , enforcerSupport = require('../support/enforcer')
  , afterTick = enforcerSupport.afterTick('monthly')
  , storySupport = require('../support/story')
  , mailer = require('../../src/server/mailer')
  , Queues = require('../../src/queues')

chai.use(require('sinon-chai'))

describe("monthly enforcer", function() {
  var story = storySupport({
    getContext: enforcerSupport.getContext,
    getSteps: enforcerSupport.steps
  })

  beforeEach(function(done) {
    setupDB(function() {
      enforcerSupport.createAccount(done)
    })
  });

  beforeEach(function() {
    sinon.stub(mailer, 'sendMail')
  });

  afterEach(function() {
    mailer.sendMail.restore()
  });

  story([
    "account owes money",
    "account billing is ok"
  ], function() {
    it.skip("charges the card on file", afterTick(function(account) {
    }));

    it.skip("updates the balance to 0", afterTick(function(account) {
      expect(account.balance).to.eq(0)
    }));
  })
})
