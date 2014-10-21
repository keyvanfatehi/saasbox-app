var mailer = require('../../../mailer')
  , config = require('../../../../../etc/config')

module.exports = function() {
  var instanceCount = this.instances.length
  if (instanceCount === 0) return false;
  var days = this.daysUntilBadStanding
  mailer.sendMail({
    to: this.email,
    subject: 'Please fix billing within '+days+' days',
    text: mailer.renderTemplate('impending_billing_neglect', {
      daysLeft: days,
      instanceCount: instanceCount,
      username: this.username,
      zone: config.zone,
      accountURL: 'https://'+config.zone+'/account'
    })
  })
}
