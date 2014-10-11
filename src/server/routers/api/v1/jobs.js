var mw = require('../../../middleware')
  , redis = require('../../../../redis')
  , router = require('express').Router()
  , expressBull = require('express-bull')

router.use(mw.authorizeAdmin);

module.exports = function (r) {
  r.use('/jobs', expressBull({
    router: router,
    redisClient: redis.client
  }))
}
