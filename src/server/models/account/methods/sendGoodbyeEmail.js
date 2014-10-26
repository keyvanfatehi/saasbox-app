var mailer = require('../../../mailer')
var config = require('../../../../../etc/config')

module.exports = function(cb) {
  mailer.sendMail({
    to: this.email || this.unverifiedEmail,
    subject: 'Account was deleted',
    text: mailer.renderTemplate('goodbye_deleted_user', {
      username: this.username
    })
  }, cb)
}
