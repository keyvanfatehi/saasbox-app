var router = require('express').Router()

router.use(require('express-defaultlocals')(function(req) {
  return {
    dist: process.env.NODE_ENV === 'production' ? 'min' : 'dev',
    user: req.user
  }
}))

require('./public')(router)
require('./admin')(router)

module.exports = router
