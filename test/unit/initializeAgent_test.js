var mw = require('../../src/server/middleware/initializeAgent');

var expect = require('chai').expect

var req, instance, agent;

describe("middleware: initializeAgent", function() {
  before(function(done) {
    agent = null;
    instance = { agent: "test" };
    req = { user: { instance: instance } }
    mw(req, null, function () {
      agent = req.agent;
      done()
    })
  });

  it("initializes req.agent", function() {
    expect(agent.ip).to.eq('127.0.0.1')
  });
});

