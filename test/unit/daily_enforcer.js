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
  , analytics = require('../../src/analytics')
  , Queues = require('../../src/queues')
  , vpsRemover = Queues.vpsRemover
  , dollar = require('../../src/cent_to_dollar')

chai.use(require('sinon-chai'))

describe("daily enforcer", function() {
  var account = null;
  var story = storySupport({
    getContext: enforcerSupport.getContext,
    getSteps: enforcerSupport.steps,
    beforeAssertions: function() {
      beforeEach(function(done) {
        enforcerSupport.tick('daily', function(err, _account) {
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
    it("is put in bad standing", function() {
      expect(account.standing).to.eq('bad')
    });

    it("sends email about bad standing", function() {
      expect(mailer.sendMail.callCount).to.eq(1);
      var email = mailer.sendMail.getCall(0).args[0]
      expect(email.subject).to.match(/bad standing/)
      expect(email.text).to.match(/past due balance of \$0.10 that we\'ve been unable to bill/)
    });
  })

  story([
    "account owes money",
    "account cannot pay",
    "account has an instance",
    "account has been unable to pay for 4 days"
  ], function() {
    it("account is not yet put in bad standing", function() {
      expect(account.standing).to.eq('good')
    });

    it("sends account standing warning email", function() {
      expect(mailer.sendMail.callCount).to.eq(1);
      var email = mailer.sendMail.getCall(0).args[0]
      expect(email.subject).to.match(/within 3 days/)
      expect(email.text).to.match(/preserve your good standing/)
    })

    it("decrements days until bad standing", function() {
      expect(account.daysUntilBadStanding).to.eq(2)
    });
  });

  story([
    "account owes money",
    "account cannot pay",
    "account has an instance",
    "account has been unable to pay for 6 days"
  ], function() {
    it("account is not yet put in bad standing", function() {
      expect(account.standing).to.eq('good')
    })

    it("sends account standing warning email", function() {
      expect(mailer.sendMail.callCount).to.eq(1);
      var email = mailer.sendMail.getCall(0).args[0]
      expect(email.subject).to.match(/within 1 days/)
      expect(email.text).to.match(/preserve your good standing/)
    })

    it("decrements days until bad standing", function() {
      expect(account.daysUntilBadStanding).to.eq(0)
    })
  });

  story([
    "account owes money",
    "account has been unable to pay for 8 days",
    "account billing is ok",
  ], function() {
    it("does not send account standing warning email", function() {
      expect(mailer.sendMail.callCount).to.eq(0);
    })

    it("account is not put in bad standing", function() {
      expect(account.standing).to.eq('good')
    })
  });

  story([
    "account has an instance",
    "account has a 0 balance"
  ], function() {

    it("updates balance movement timestamp", function() {
      var instance = account.instances[0]
      expect(
        moment(instance.balanceMovedAt)
        .isAfter(moment().subtract(1, 'second'))
      ).to.eq(true, 'balance movement timestamp not updated');
    })

    it("updates account balance", function() {
      var balance = dollar(account.balance).toString()
      expect(balance).to.eq('1.79')
    })
  })

  story([
    "account has an instance",
    "account owes money",
    "account cannot pay",
    "account has been unable to pay for 3 days",
    "account is in good standing"
  ], function() {
    it("does not send account standing warning email", function() {
      expect(mailer.sendMail.callCount).to.eq(0);
    })

    it("does not delete the user's instances", function() {
      expect(vpsRemover.add.callCount).to.eq(0)
    })
  });

  story([
    "account has an instance",
    "account is in bad standing",
  ], function() {
    it("deletes the instance", function() {
      expect(vpsRemover.add.callCount).to.eq(1)
      expect(vpsRemover.add).to.have.been.calledWith({
        cloudProvider: 'rax', dnsRecords: ["234", "123"], vps: 567
      });
      expect(account.instances.length).to.eq(0)
    })

    it("sends email notifying that instance was destroyed", function() {
      expect(mailer.sendMail.callCount).to.eq(1);
      var email = mailer.sendMail.getCall(0).args[0]
      expect(email.subject).to.match(/Deleted instance/)
      expect(email.text).to.match(/has been deleted/)
    })
  })
})
