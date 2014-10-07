var authorizeAdmin = require('../../middleware/authorizeAdmin')
  , renderNamespace = require('../../middleware/renderNamespace')
  , dollar = require('../../../cent_to_dollar')
  , models = require('../../models')
  , Instance = models.Instance
  , Account = models.Account

module.exports = function(r) {

  r.use(authorizeAdmin, renderNamespace({
    viewPath: 'admin',
    defaultLocals: {
      layout: 'layouts/admin',
      dollar: dollar
    }
  }));


  r.get('/admin', function(req, res) {
    res.render('dashboard');
  })

  r.get('/admin/jobs', function(req, res) {
    res.render('jobs')
  })

  r.get('/admin/accounts', function(req, res) {
    Account.find({}).populate('instances', [
      'slug', 'size.cents', 'fqdn', 'notes.url'
    ].join(' ')).exec(function(err, accounts) {
      if (err) return next(err);
      res.render('accounts', {
        accounts: accounts
      })
    })
  })

  function initInstance (req, res, next) {
    Instance.findById(req.params.id).exec(function(err, instance) {
      if (err) return next(err);
      req.instance = instance;
      next();
    })
  }

  function renderInstance(req, res) {
    res.render('instance', req.instance.toJSON())
  }

  r.get('/admin/instances/:id', initInstance, renderInstance)

  r.get('/admin/instances/:id/fix_dns', initInstance, function(req, res, next) {
    req.instance.setupDNS(function(err) {
      if (err) return next(err);
      else return res.redirect('back');
    })
  })
}
