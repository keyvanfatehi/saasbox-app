var Account = require('../../models').Account
  , passport = require('passport')
  , registrationValidator = require('../../../validators/registration')
  , mw = require('../../middleware')

module.exports = function(router) {
  router.get('/register', function(req, res) {
    res.render('register', {errors:[]});
  });

  router.get('/login', function(req, res) {
    if (req.user)
      res.redirect('/')
    else
      res.render('login', { user : req.user });
  });

  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), mw.loginRequired.afterLogin);

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/verify_email', function(req, res, next) {
    Account.verifyEmailByToken(req.query.token, function(err) {
      if (err) req.flash('error', 'Confirmation code has expired.');
      else req.flash('info', 'Thank you for confirming your email address!');
      res.redirect('/')
    })
  })

  router.post('/register', function(req, res, next) {
    var flashBack = function(err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    var errors = registrationValidator(req.body)
    if (errors.length) return flashBack(errors[0]);
    Account.findOneAsync({ email: req.body.email }).then(function(dupe) {
      if (dupe) throw new Error("Email is already in use. Use 'forgot password' to recover your account.")
      return Account.findOneAsync({ username: req.body.username })
    }).then(function(dupe) {
      if (dupe) throw new Error('Username is already in use');
      // delete any accounts that were also planning to use this email address
      return Account.removeAsync({ unverifiedEmail: req.body.email })
    }).then(function(num) {
      var token = Math.random().toString(34).substring(2)
      var account = new Account({
        username: req.body.username,
        unverifiedEmail: req.body.email,
        unverifiedEmailToken: token
      })
      return Account.registerAsync(account, req.body.password)
    }).then(function(account) {
      return passport.authenticate('local')(req, res, function () {
        var host = req.protocol+'://'+req.get('host') 
        account.sendNewUserWelcomeEmail({
          url: host+'/verify_email?token='+account.unverifiedEmailToken
        })
        req.flash('info', 'Thank you for signing up. We have sent a confirmation email to '+req.body.email)
        next()
      });
    }).error(flashBack).catch(flashBack)
  }, mw.loginRequired.afterLogin);
}
