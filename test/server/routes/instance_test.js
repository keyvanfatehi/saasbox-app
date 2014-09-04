var expect = require('chai').expect
  , request = require('supertest')
  , app = require('../../../src/server/app')

describe("GET /api/v1/instance", function () {
  it("returns instance info as json", function(done) {
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

describe("PUT /api/v1/instance status=on", function () {
  it("turns on the instance and returns instance info as json", function(done) {
    request(app)
    .put('/api/v1/instance')
    .send({ status: 'on' })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) throw err;
      expect(res.body.status).to.eq('off')
      done()
    })
  })
})
