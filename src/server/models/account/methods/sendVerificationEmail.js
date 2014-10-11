var mailer = require('../../../mailer')

module.exports = function(opts, cb) {
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
}
