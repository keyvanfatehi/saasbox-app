var express = require('express')
  , router = express.Router()
  , products = require('../../../../products')
  , Account = require('../../models').Account

router.get('/', function(req, res, next) {
  res.render('landing')
})

require('./login_register')(router)
require('./forgot_password')(router)
require('./change_password')(router)

router.get('/verify_email', function(req, res, next) {
  Account.verifyEmailByToken(req.query.token, function(err) {
    console.log('ok');
    if (err) 
      req.flash('error', 'That appears to be an invalid confirmation code.')
    else
      req.flash('info', 'Thank you for confirming your email address!')
    console.log('well');
    res.redirect('/')
  })
})

router.get('/vote_apps', function(req, res) {
  res.render('vote_apps')
})

for (var slug in products) {
  var product = products[slug];
  if (product.websiteIsLocal) {
    router.use(product.websiteURL, express.static(product.websitePath));
  }
}

module.exports = router
