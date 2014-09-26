var Queue = require('bull')
  , config = require('../etc/config')

module.exports = function(name) {
  return Queue(name, config.redis.port, config.redis.host, config.redis.options)
}
