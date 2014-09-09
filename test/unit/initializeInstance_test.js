var mw = require('../../src/server/middleware/initializeInstance');

var expect = require('chai').expect

var req, instance;

describe("middleware: initializeInstance", function() {
  before(function(done) {
    instance = null;
    req = { user: { username: 'bob' } }
    mw(req, null, function () {
      instance = req.user.instance;
      done()
    })
  });

  it("selects the first agent", function() {
    expect(instance.agent).to.eq('test')
  });

  it("sets the product slug", function () {
    expect(instance.slug).to.eq('strider')
  })

  it("sets the namespace to the username", function() {
    expect(instance.namespace).to.eq('bob')
  });
});
