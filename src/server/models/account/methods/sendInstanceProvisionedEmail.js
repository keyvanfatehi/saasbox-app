var mailer = require('../../../mailer')
  , config = require('../../../../../etc/config')

module.exports = function(opts, cb) {
  var product = opts.instance.getProduct();
  mailer.sendMail({
    to: this.email,
    subject: 'Your new instance of '+product.title+' is live!',
    text: mailer.renderTemplate('instance_provisioned', {
      username: this.username,
      productTitle: product.title,
      instanceURL: this.notes.url,
      appsURL: 'https://'+config.zone+'/apps'
    })
  }, cb)
}

