var redis = require('redis')
  , config = require('../etc/config')

function createClient() {
  return redis.createClient(config.redis)
}

var mainClient = createClient()

module.exports = {
  client: mainClient,
  createClient: createClient
}

