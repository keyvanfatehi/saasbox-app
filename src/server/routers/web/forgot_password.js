var mailer = require('../../mailer')
  , Account = require('../../models').Account
  , registrationValidator = require('../../../validators/registration')

module.exports = function(router) {
  router.get('/forgot_password', function(req, res) {
    res.render('forgot_password', { sent_to: null });
  });

  router.post('/forgot_password', function(req, res, next) {
    var done = function(email) {
      res.render('forgot_password', { sent_to: email || null })
    }
    Account.findOne({ email: req.body.email }, function(err, account) {
      if (err || !account) {
        done()
      } else {
        account.generatePasswordRecoveryToken(function(err, token) {
          var host = req.protocol+'://'+req.get('host')
          req.user.sendForgotPasswordEmail({
            url: host+'/reset_password?token='+token
          }, function(err) {
            if (err) return next(err);
            else return done(account.email)
          })
        })
      }
    })
  });

  router.get('/reset_password', function(req, res) {
    Account.findOne({
      passwordRecoveryToken: req.query.token
    }, function(err, account) {
      if (err) return res.status(404).end();
      res.render('change_password', { account: account });
    })
  });
}
