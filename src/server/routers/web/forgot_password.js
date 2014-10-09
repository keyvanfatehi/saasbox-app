var mailer = require('../../mailer')
  , Account = require('../../models').Account
  , registrationValidator = require('../../../validators/registration')

module.exports = function(router) {
  router.get('/forgot_password', function(req, res) {
    res.render('forgot_password', { sent_to: null });
  });

  router.post('/forgot_password', function(req, res) {
    var done = function(email) {
      res.render('forgot_password', { sent_to: email || null })
    }
    Account.findOne({ email: req.body.email }, function(err, account) {
      if (err || !account) {
        done()
      } else {
        account.generatePasswordRecoveryToken(function(err, token) {
          var url = req.protocol+'://'+req.get('host')+'/reset_password?token='+token
          mailer.sendMail({
            to: account.email,
            subject: 'Password Recovery',
            text: 'Please click here to reset your password: '+url
          }, function(err) {
            console.log('mailier sending', err)
            if (err) return done();
            done(account.email)
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
