var router = require('express').Router()
  , product = require('../../../../product')
  , passport = require('passport')
  , Account = require('../../models/account')
  , registrationValidator = require('../../../validators/registration')
  , config = require('../../../../etc/config')
  , Agent = require('../../agent')
  , logger = require('winston')

router.get('/', function(req, res, next) {
  if (req.user) {
    res.render('dashboard', { user: req.user })
  } else {
    res.render('landing')
  }
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


module.exports = router
