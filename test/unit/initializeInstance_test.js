var mw = require('../../src/server/middleware/initializeInstance');

var expect = require('chai').expect

var req, instance;

describe("middleware: initializeInstance", function() {
  before(function(done) {
    instance = null;
    var slug = 'strider'
    req = {
      user: { username: 'bob' },
      params: { slug: slug }
    }
    mw(req, null, function () {
      instance = req.user.instances[slug];
      done()
    })
  });

  it("selects the first agent (for now)", function() { //TODO
    expect(instance.agent).to.eq('test')
  });

  it("sets the namespace to the username", function() {
    expect(instance.namespace).to.eq('bob')
  });
});
