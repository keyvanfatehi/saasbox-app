var authorizeUser = require('../../../../middleware/authorizeUser')
  , config = require('../../../../../../etc/config')
  , nodemailer = require('nodemailer')


// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(config.mail.transport);

module.exports = function (r) {
  r.route('/account/email')
  .put(authorizeUser, function(req, res, next) {
    var email = req.body.email;
    var token = req.body.token;
    console.log('email, token', email, token);
    if (email) {
      var token = Math.random().toString(16).substring(2)
      req.user.update({
        unverifiedEmail: email,
        unverifiedEmailToken: token
      }, function(err) {
        if (err) return next(err);
        var mailOptions = {
          from: 'Do Not Reply <no-reply@'+config.zone+'>',
          to: email,
          subject: config.zone+' Email Confirmation Code',
          text: 'Your email address confirmation code is '+token
        };
        console.log(mailOptions);
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Message sent: ' + info.response);
            res.status(204).end();
          }
        });
      })
    } else if (token) {
      if (req.user.unverifiedEmailToken === token) {
          req.user.update({
            email: req.user.unverifiedEmail,
            unverifiedEmail: null,
            unverifiedEmailToken: null
          }, function(err, account) {
            if (err) return next(err);
            res.json({ valid: true, email: account.email })
          });
        } else {
        res.json({ valid: false })
      }
    } else {
      res.status(304).end();
    }
  })
}
