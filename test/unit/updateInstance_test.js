var _mw = require('../../src/server/middleware/updateInstance');

var stub = require('sinon').stub
var expect = require('chai').expect

var req, user, instance, agent;

var mw = function (body, api_res, done) {
  instance = { fqdn: 'example.com' }
  agent = {
    perform: stub().yields(null, api_res),
    createProxy: stub().yields(null),
    destroyProxy: stub(), 
  }
  user = { username: "bob", instance: instance, update: stub().yields(null) }
  req = { body: body, user: user, agent: agent }
  _mw(req, null, done);
}

describe("middleware: updateInstance status=off", function() {
  before(function(done) {
    mw({ status: 'off' }, {}, done);
  });

  it("destroys proxy", function() {
    expect(agent.destroyProxy.getCall(0).args).to.deep.eq(['example.com'])
  });
});

describe("middleware: updateInstance status=on", function() {
  before(function(done) {
    var app = { email: "foo@bar.com", url: "http://localhost:12345" }
    mw({ status: 'on' }, { body: { app: app } }, done);
  });

  it("creates the proxy", function() {
    var args = agent.createProxy.getCall(0).args
    expect(args[0]).to.eq("strider-bob.example.com")
    expect(args[1]).to.eq("http://localhost:12345")
  });
});

