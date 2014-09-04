var expect = require('chai').expect
  , request = require('supertest')
  , app = require('../../../src/server/app')

describe("GET /api/v1/instance", function () {
  it("returns the user's instance metadata as json", function(done) {
    request(app)
    .get('/api/v1/instance')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) throw err;
      expect(res.body.status).to.eq('off')
      done()
    })
  })
})
