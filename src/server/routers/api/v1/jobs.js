var authorizeAdmin = require('../../../middleware/authorizeAdmin')
  , redis = require('../../../../redis')
  , router = require('express').Router()
  , expressBull = require('express-bull')

router.use(authorizeAdmin);

module.exports = function (r) {
  r.use('/jobs', expressBull({
    router: router,
    redisClient: redis.client
  }))
}
