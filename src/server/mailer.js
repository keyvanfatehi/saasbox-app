var fs = require('fs')
  , ejs = require('ejs')
  , path = require('path')
  , logger = require('../logger')
  , nodemailer = require('nodemailer')
  , config = require('../../etc/config')
  , emailTemplates = __dirname+'../../views/emails'
  , transport = nodemailer.createTransport(config.email)

module.exports = {
  sendMail: function(opts, callback) {
    logger.info('sending email', {
      mail: opts
    });
    if (!opts.subject) throw new Error('no mail subject')
    if (!opts.to) throw new Error('no mail recipients')
    if (!opts.text) throw new Error('no mail body')
    transport.sendMail({
      from: 'Pillbox <no-reply@'+config.zone+'>',
      subject: 'Pillbox: '+opts.subject,
      to: opts.to,
      text: opts.text
    }, function(error, info) {
      if (error) logger.error('error sending email', {
        type: 'mail',
        stack: error.stack
      });
      else logger.info('Message sent: ' + info.response);
      if (callback) callback(error, info);
    })
  },
  renderTemplate: function(name, locals) {
    var tmpl = path.join(emailTemplates, name);
    return ejs.render(fs.readFileSync(tmpl), locals)
  }
}
