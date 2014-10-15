process.env.NODE_ENV = 'test';
var models = require('../../src/server/models')
  , chai = require('chai')
  , expect = chai.expect
  , sinon = require('sinon')
  , setupDB = require('../support/db').setup
  , vpsRemoverQueue = require('../../src/queues').vpsRemover

chai.use(require('sinon-chai'))

describe.only("Instance#selfDestruct", function() {
  var instance = null;
  var account = null;

  before(function(done) {
    setupDB(function() {
      account = new models.Account({})
      instance = new models.Instance({
        cloudProvider: 'rax',
        fqdn: '123',
        agent: {
          fqdn: '234',
          vps: { id: '345' }
        },
        size: { cents: 5000 },
        account: account._id
      })
      account.save(function() {
        instance.save(done)
      })
    })
  })

  beforeEach(function(done) {
    sinon.stub(vpsRemoverQueue, 'add');
    instance.selfDestruct(function(err) {
      done(err);
    });
  });

  afterEach(function() {
    vpsRemoverQueue.add.restore();
  });

  it("deletes the instance", function(done) {
    models.Instance.count({ _id: instance._id }).exec(function(err, c) {
      expect(c).to.eq(0);
      done(err)
    })
  });

  it("queues a removal job", function() {
    expect(vpsRemoverQueue.add).to.have.been.calledExactlyOnce;
    expect(vpsRemoverQueue.add).to.have.been.calledWith({
      cloudProvider: 'rax', dnsRecords: ["234", "123"], vps: "345"
    });
  });
});
