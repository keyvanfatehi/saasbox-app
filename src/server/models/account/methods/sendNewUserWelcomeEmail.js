var mailer = require('../../../mailer')

module.exports = function(opts, cb) {
  mailer.sendMail({
    to: this.unverifiedEmail,
    subject: 'Welcome! Please verify your email address',
    text: [
      'Thank you for creating a Pillbox account',
      'Please click here to verify your email address:',
      opts.url
    ].join('\n')
  }, cb)
}
