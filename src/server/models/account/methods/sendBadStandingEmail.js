var mailer = require('../../../mailer')
  , config = require('../../../../../etc/config')
  , dollar = require('../../../../cent_to_dollar')

module.exports = function() {
  mailer.sendMail({
    to: this.email,
    subject: 'Your account has been placed in bad standing',
    text: mailer.renderTemplate('bad_standing', {
      username: this.username,
      zone: config.zone,
      dollarsOwed: dollar(this.balance),
      accountURL: 'https://'+config.zone+'/account'
    })
  })
}
