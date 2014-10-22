var mailer = require('../../../mailer')
var config = require('../../../../../etc/config')

module.exports = function(opts, cb) {
  mailer.sendMail({
    to: this.unverifiedEmail,
    subject: 'Welcome! Please verify your email address',
    text: mailer.renderTemplate('welcome_new_user', {
      username: this.username,
      verificationURL: opts.url
    })
  }, cb)
}
