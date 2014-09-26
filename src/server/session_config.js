var config = require('../../etc/config')
  , session = require('express-session')
  , redis = require('../redis')
  , RedisStore = require('connect-redis')(session)

module.exports = {
  store: new RedisStore({ client: redis.client }),
  secret: config.cookie_secret,
  key: config.cookie_name
}
