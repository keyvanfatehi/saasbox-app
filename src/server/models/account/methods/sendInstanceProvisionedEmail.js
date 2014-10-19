var mailer = require('../../../mailer')
  , config = require('../../../../../etc/config')

module.exports = function(instance, cb) {
  var product = instance.getProduct();
  var locals = {
    username: this.username,
    productTitle: product.title,
    instanceURL: instance.notes.url,
    appsURL: 'https://'+config.zone+'/instances'
  }
  var mailBody = mailer.renderTemplate('instance_provisioned', locals)
  mailer.sendMail({
    to: this.email,
    subject: 'Your new instance of '+product.title+' is live!',
    text: mailBody
  }, cb)
}

