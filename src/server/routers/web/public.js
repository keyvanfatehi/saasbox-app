var express = require('express')
  , router = express.Router()
  , products = require('../../../../products')

router.get('/', function(req, res, next) {
  res.render('landing')
})

require('./login_register')(router)
require('./forgot_password')(router)
require('./change_password')(router)

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
