var mailer = require('../../../mailer')

module.exports = function(opts, cb) {
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
}
