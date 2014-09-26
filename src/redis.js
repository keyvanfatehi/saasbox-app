var redis = require('redis')
  , config = require('../etc/config')
  , _ = require('lodash')

//config.redis.options.return_buffers = true

function createClient(returnBuffers) {
  var port = config.redis.port;
  var host = config.redis.host;
  var options = _.assign({}, {
    return_buffers: !!returnBuffers
  }, config.redis.options)
  return redis.createClient(port, host, options)
}

var mainClient = createClient()

module.exports = {
  client: mainClient,
  createClient: createClient
}

