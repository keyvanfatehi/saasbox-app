var mailer = require('../../../mailer')

module.exports = {
  isBillingOk: require('./isBillingOk'),
  updateBillingInfo: require('./updateBillingInfo'),
  generatePasswordRecoveryToken: function(cb) {
    var token = Math.random().toString(36).substring(2)
    this.update({
      passwordRecoveryToken: token
    }, function(err) {
      if (err) return cb(err);
      cb(null, token)
    })
  },
  sendVerificationEmail: function(opts, cb) {
    var token = this.unverifiedEmailToken;
    var url = opts.url;
    mailer.sendMail({
      to: this.unverifiedEmail,
      subject: 'Please verify your email address',
      text: [
        'Your email address verification code is '+token,
        'To verify this email address enter the token manually or click here:',
        url
      ].join('\n')
    }, cb)
  },
  sendNewUserWelcomeEmail: function(opts, cb) {
    var token = this.unverifiedEmailToken;
    var url = opts.url;
    mailer.sendMail({
      to: this.unverifiedEmail,
      subject: 'Welcome! Please verify your email address',
      text: [
        'Thank you for creating a Pillbox account',
        'Please click here to verify your email address:',
        url
      ].join('\n')
    }, cb)
  },
  sendForgotPasswordEmail: function(opts, cb) {
    var url = opts.url;
    mailer.sendMail({
      to: [this.email, this.unverifiedEmail],
      subject: 'Password Recovery',
      text: [
        'Please click here to reset your password:',
        url
      ].join('\n')
    }, cb)
  }
}
