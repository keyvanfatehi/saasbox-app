var router = require('express').Router()
  , version = require('../../../../package').version
  , priceMatrix = require('../../../../etc/price_matrix')
  , config = require('../../../../etc/config')
  , products = require('../../../../products')
  , regions = require('../../../../etc/regions')
  , authorizeUser = require('../../middleware/authorizeUser')

var setWebLocals = require('express-defaultlocals')(function(req) {
  return {
    dist: process.env.NODE_ENV === 'production' ? 'min' : 'dev',
    version: version,
    priceMatrix: priceMatrix,
    user: req.user,
    products: products,
    regions: regions,
    notice: null
  }
})

// the following routes are defined in the
// order of most public to most private

router.use(setWebLocals)

router.get('/', function(req, res, next) {
  res.render('landing')
})

require('./login_register')(router)
require('./forgot_password')(router)
require('./change_password')(router)

router.use(authorizeUser)

router.get('/account', function(req, res) {
  res.render('my_account')
})

router.get('/verify_email', function(res, res, next) {
  if (req.user.unverifiedEmailToken === token) {
    var email = req.user.unverifiedEmail
    req.user.update({
      email: email,
      unverifiedEmail: null,
      unverifiedEmailToken: null
    }, function(err) {
      if (err) return next(err);
      res.json({ valid: true, email: email })
    });
  } else {
    res.json({ valid: false })
  }
})

router.get('/apps', function(req, res) {
  req.user.populate('instances', function(err) {
    res.render('my_apps')
  })
})

router.get('/support', function(req, res) {
  res.render('support')
})

require('./admin')(router)

module.exports = router
