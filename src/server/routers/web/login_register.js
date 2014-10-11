var Account = require('../../models').Account
  , passport = require('passport')
  , registrationValidator = require('../../../validators/registration')

module.exports = function(router) {
  router.get('/register', function(req, res) {
    res.render('register', {errors:[]});
  });

  router.post('/register', function(req, res, next) {
    var errors = registrationValidator(req.body)
    if (errors.length > 0) {
      res.render('register', { errors: errors })
    } else {
      Account.findOne({ email: req.body.email }).exec(function(err, dupe) {
        if (err) return next(err);
        if (dupe) return res.render("register", {
          errors: [
            "Email is already in use. Use 'forgot password' to recover your account."
          ]
        });
        var token = Math.random().toString(34).substring(2)
        var account = new Account({
          username: req.body.username,
          unverifiedEmail: req.body.email,
          unverifiedEmailToken: token
        })
        Account.register(account, req.body.password, function(err, account) {
          if (err) return res.render("register", {
            errors: [
              "Username is already in use."
            ]
          });
          else return passport.authenticate('local')(req, res, function () {
            var host = req.protocol+'://'+req.get('host') 
            // send a welcome email 
            account.sendNewUserWelcomeEmail({
              url: host+'/verify_email?token='+token
            }, function(err) {})
            res.render('landing', {
              notice: 'Thank you for signing up. We have sent a confirmation email to '+req.body.email
            });
          });
        });
      })
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
}
