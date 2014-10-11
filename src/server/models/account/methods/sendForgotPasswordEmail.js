var mailer = require('../../../mailer')

module.exports = function(opts, cb) {
  var url = opts.url;
  mailer.sendMail({
    to: [this.email, this.unverifiedEmail],
    subject: 'Password Recovery',
    text: [
      'Please click here to reset your password:',
      url
    ].join('\n')
  }, cb)
}
