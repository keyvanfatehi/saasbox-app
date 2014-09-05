var config = require('../../etc/config')
  , client = require('./redis')
  , session = require('express-session')
  , RedisStore = require('connect-redis')(session)

module.exports = session({
  store: new RedisStore({
    redis: client,
    ttl: 10 * 60 // 10 minute sessions
  }),
  secret: config.secret
});
