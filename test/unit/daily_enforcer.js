process.env.NODE_ENV = 'test';
var models = require('../../src/server/models')
  , chai = require('chai')
  , expect = chai.expect
  , moment = require('moment')
  , sinon = require('sinon')
  , setupDB = require('../support/db').setup
  , enforcerSupport = require('../support/enforcer')
  , afterTick = enforcerSupport.afterTick('daily')
  , storySupport = require('../support/story')
  , mailer = require('../../src/server/mailer')
  , analytics = require('../../src/analytics')
  , Queues = require('../../src/queues')
  , vpsRemover = Queues.vpsRemover

chai.use(require('sinon-chai'))

describe("daily enforcer", function() {
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
    sinon.stub(analytics, 'track')
    sinon.stub(vpsRemover, 'add')
  });

  afterEach(function() {
    mailer.sendMail.restore()
    analytics.track.restore()
    vpsRemover.add.restore()
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
    "account has an instance",
    "account has been unable to pay for 6 days"
  ], function() {
    it("account is not yet put in bad standing", afterTick(function(account) {
      expect(account.standing).to.eq('good')
    }));

    it("sends account standing warning email", afterTick(function(account) {
      expect(mailer.sendMail.callCount).to.eq(1);
      var email = mailer.sendMail.getCall(0).args[0]
      expect(email.subject).to.match(/within 1 days/)
      expect(email.text).to.match(/preserve your good standing/)
    }))
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
      expect(account.balance).to.be.closeTo(17, 1);
    }))
  })

  story([
    "account has an instance",
    "account owes money",
    "account cannot pay",
    "account has been unable to pay for 3 days",
    "account is in good standing"
  ], function() {
    it("sends account standing warning email", afterTick(function(account) {
      expect(mailer.sendMail.callCount).to.eq(1);
      var email = mailer.sendMail.getCall(0).args[0]
      expect(email.subject).to.match(/within 4 days/)
      expect(email.text).to.match(/preserve your good standing/)
    }))

    it("does not delete the user's instances", afterTick(function(account) {
      expect(vpsRemover.add.callCount).to.eq(0)
    }));
  });

  story([
    "account has an instance",
    "account is in bad standing",
  ], function() {
    it("deletes the instance", afterTick(function(account) {
      expect(vpsRemover.add.callCount).to.eq(1)
      expect(vpsRemover.add).to.have.been.calledWith({
        cloudProvider: 'rax', dnsRecords: ["234", "123"], vps: 567
      });
      expect(account.instances.length).to.eq(0)
    }));

    it("sends email notifying that instance was destroyed", afterTick(function() {
      expect(mailer.sendMail.callCount).to.eq(1);
      var email = mailer.sendMail.getCall(0).args[0]
      expect(email.subject).to.match(/Deleted instance/)
      expect(email.text).to.match(/has been deleted/)
    }));
  })
})
