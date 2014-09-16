var router = require('express').Router()
  , products = require('../../../../products')
  , passport = require('passport')
  , Account = require('../../models/account')
  , registrationValidator = require('../../../validators/registration')
  , config = require('../../../../etc/config')
  , Agent = require('../../agent')
  , logger = require('winston')
  , Mailhide = require('mailhide')
  , mailhider = new Mailhide(config.mailhide)

router.use(require('express-defaultlocals')(function(req) {
  return {
    user: req.user,
    version: require('../../../../package').version
  }
}))

router.get('/', function(req, res, next) {
  res.render(req.user ? 'dashboard' : 'landing', {
    user: req.user,
    products: products,
    slugs: Object.keys(products),
  });
})

router.get('/register', function(req, res) {
  res.render('register', {errors:[]});
});

router.post('/register', function(req, res) {
  var errors = registrationValidator(req.body)
  if (errors.length > 0) {
    res.render('register', { errors: errors })
  } else {
    var account = new Account({ username : req.body.username })
    Account.register(account, req.body.password, function(err, account) {
      if (err) {
        res.render("register", { errors: ["Username is already in use."] } );
      } else {
        passport.authenticate('local')(req, res, function () {
          res.redirect('/');
        });
      }
    });
  }
});

router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/faq', function(req, res) {
  res.render('faq', {
    keyvanEmail: mailhider.url('keyvanfatehi@gmail.com')
  });
})

module.exports = router
