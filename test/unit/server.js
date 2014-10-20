process.env.NODE_ENV = 'test';
var expect = require('chai').expect
  , spawnSupport = require('../support/spawn')
  , needle = require('needle')

describe("Server", function() {
  var proc = null;
  var port = 49991;

  var url = function(path) {
    return 'http://localhost:'+port+path
  }

  spawnSupport.manage({
    cmd: 'node',
    args: [ __dirname+'/../../server.js' ],
    env: {
      PORT: port,
      PATH: process.env.PATH
    },
    match: /listening/
  })

  it("can serve the landing page", function(done) {
    needle
    .get(url('/'), function(err, res) {
      expect(res.statusCode).to.eq(200);
      expect(res.body).to.match(/Strider/);
      done(err)
    })
  });
});
