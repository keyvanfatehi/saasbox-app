var router = require('express').Router()
  , mw = require('../../middleware')
  , series = require('middleware-flow').series
  , models = require('../../models')
  , Account = models.Account
  , initInstance = mw.initInstanceByIdParam

var scope = series(
  mw.authorizeAdmin,
  mw.renderNamespace({
    viewPath: 'admin',
    defaultLocals: {
      layout: 'layouts/admin'
    }
  })
);


router.get('/', scope, function(req, res) {
  res.render('dashboard');
})

router.get('/jobs', scope, function(req, res) {
  res.render('jobs')
})

router.get('/accounts', scope, function(req, res) {
  Account.find({}).populate('instances', [
    'slug', 'size.cents', 'fqdn', 'notes.url'
  ].join(' ')).exec(function(err, accounts) {
    if (err) return next(err);
    res.render('accounts', {
      accounts: accounts
    })
  })
})

router.get('/instances/:id', scope, initInstance, function(req, res) {
  res.render('instance', req.instance.toJSON())
})

router.get('/instances/:id/fix_dns', scope, initInstance, function(req, res, next) {
  req.instance.setupDNS(function(err) {
    if (err) return next(err);
    else return res.redirect('back');
  })
})

module.exports = router;
