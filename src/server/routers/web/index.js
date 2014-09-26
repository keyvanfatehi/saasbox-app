var router = require('express').Router()

var setWebLocals = require('express-defaultlocals')(function(req) {
  return {
    dist: process.env.NODE_ENV === 'production' ? 'min' : 'dev',
    user: req.user
  }
})

router.use(setWebLocals)
require('./public')(router)
require('./admin')(router)

module.exports = router
