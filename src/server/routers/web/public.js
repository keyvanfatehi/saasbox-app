var express = require('express')
  , router = express.Router()
  , models = require('../../models')
  , products = require('../../../../products')

router.get('/', function(req, res, next) {
  res.render('landing')
})

require('./login_register')(router)
require('./forgot_password')(router)
require('./change_password')(router)

router.get('/vote', function(req, res) {
  res.render('vote')
})

router.post('/vote', function(req, res, next) {
  new models.Vote(req.body).save(function(err) {
    if (err) return next(err);
    req.flash('info', 'Your vote for <b>'+req.body.name+'</b> has been counted. Thank you!')
    res.redirect('/')
  })
})

router.get('/support', function(req, res) {
  res.render('support')
})

for (var slug in products) {
  var product = products[slug];
  if (product.websiteIsLocal) {
    router.use(product.websiteURL, express.static(product.websitePath));
  }
}

module.exports = router
