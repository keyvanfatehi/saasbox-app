var config = require('../../etc/config')
  , session = require('express-session')
  , RedisStore = require('connect-redis')(session)

module.exports = {
  store: new RedisStore(config.redis),
  secret: config.cookie_secret,
  key: config.cookie_name
}
