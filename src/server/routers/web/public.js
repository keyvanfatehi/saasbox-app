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
  req.body.vote = true;
  new models.AppRequest(req.body).save(function(err) {
    if (err) return next(err);
    req.flash('info', 'Your vote for <b>'+req.body.name+'</b> has been counted. Thank you!')
    res.redirect('/')
  })
})

router.get('/monetize', function(req, res) {
  res.render('monetize')
})

router.post('/monetize', function(req, res, next) {
  req.body.monetize = true;
  if (/@/.test(req.body.email)) {
    new models.AppRequest(req.body).save(function(err) {
      if (err) return next(err);
      req.flash('info', 'You request has been submitted. We will reach out to you soon. Thank you!')
      res.redirect('/')
    })
  } else {
    req.flash('error', 'Please provide an email address')
    res.redirect('back')
  }
})

//router.get('/support', function(req, res) {
//  res.render('support')
//})

for (var slug in products) {
  var pub = __dirname+'/../../../../products/'+slug+'/public'
  router.use('/apps/'+slug, express.static(pub));
}

module.exports = router
