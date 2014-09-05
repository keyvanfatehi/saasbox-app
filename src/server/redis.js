var redis = require("redis")
  , config = require('../../etc/config').redis
  , client = redis.createClient(config.port, config.host, {
    auth_pass: config.auth_pass
  })

module.exports = client;
