var mailer = require('../../../mailer')
  , config = require('../../../../../etc/config')

module.exports = function(instance, cb) {
  var product = instance.getProduct();
  var locals = {
    username: this.username,
    productTitle: product.title,
    instanceURL: instance.notes.url
  }
  var mailBody = mailer.renderTemplate('instance_deleted', locals)
  mailer.sendMail({
    to: this.email,
    subject: 'Deleted instance '+product.title+' instance',
    text: mailBody
  }, cb)
}
