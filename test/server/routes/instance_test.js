var expect = require('chai').expect
  , request = require('supertest')
  , app = require('../../../src/server/app')
  , nock = require('nock')

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
  var agent = null

  beforeEach(function() {
    agent = nock('http://localhost:4000')
    .post('/api/v1/drops/strider/install', {
      namespace: 'myuser'
    })
    .reply(204);  
  });

  it("returns 204 and forwards task to the agent", function(done) {
    request(app)
    .put('/api/v1/instance')
    .send({ 
      status: 'on'
    })
    .expect(204)
    .end(function (err, res) {
      if (err) throw err;
      agent.done()
      done()
    })
  })
})
