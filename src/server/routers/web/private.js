var router = require('express').Router()
  , mw = require('../../middleware')

router.use(mw.loginRequired.requireUser)

router.get('/account', function(req, res) {
  res.render('my_account')
})

router.get('/apps', function(req, res) {
  res.render('monetize')
})

router.get('/instances', function(req, res) {
  req.user.populate('instances', function(err) {
    res.render('my_instances')
  })
})

require('./admin')(router)

module.exports = router
