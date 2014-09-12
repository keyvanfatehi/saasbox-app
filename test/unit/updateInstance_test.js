var _mw = require('../../src/server/middleware/updateInstance');

var dns = require('../../src/server/dns');

var stub = require('sinon').stub
var expect = require('chai').expect

var req, user, instance, agent;

var mw = function (body, api_res, done) {
  instance = {
    fqdn: 'example.com'
  }
  agent = {
    ip: '123.123.123.123',
    perform: stub().yields(null, api_res),
    createProxy: stub().yields(null),
    destroyProxy: stub(), 
  }
  user = {
    username: "bob",
    update: stub().yields(null),
    instances: {
      strider: instance
    },
    stripe: {
      valid: true
    }
  }
  req = {
    body: body,
    user: user,
    agent: agent,
    params: { slug: 'strider' }
  }
  _mw(req, null, done);
}

describe("middleware: updateInstance", function() {
  describe("status=off", function() {
    before(function(done) {
      stub(dns, 'deleteRecord').yields(null);
      mw({ status: 'off' }, {}, done);
    });

    it("updates the record", function() {
      expect(req.user.update.callCount).to.eq(1);
    });

    it("destroys proxy", function() {
      expect(agent.destroyProxy.getCall(0).args).to.deep.eq(['example.com'])
    });

    it("destroys dns record", function() {
      var args = dns.deleteRecord.getCall(0).args
      expect(args[0]).to.eq('strider-bob.example.com');
      expect(args[1]).to.be.an.instanceof(Function);
    });
  });

  describe("status=on", function() {
    before(function(done) {
      stub(dns, 'addRecord').yields(null);
      var app = { email: "foo@bar.com", url: "http://localhost:12345" }
      mw({ status: 'on' }, { body: { app: app } }, done);
    });

    it("updates the record", function() {
      expect(req.user.update.callCount).to.eq(1);
    });

    it("creates the proxy", function() {
      var args = agent.createProxy.getCall(0).args
      expect(args[0]).to.eq("strider-bob.example.com")
      expect(args[1]).to.eq("http://localhost:12345")
    });

    it("creates dns record", function() {
      var args = dns.addRecord.getCall(0).args
      expect(args[0]).to.eq('strider-bob.example.com');
      expect(args[1]).to.eq('123.123.123.123')
      expect(args[2]).to.be.an.instanceof(Function);
    });
  });
});
