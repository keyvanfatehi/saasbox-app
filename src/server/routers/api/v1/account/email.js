var authorizeUser = require('../../../../middleware/authorizeUser')
  , config = require('../../../../../../etc/config')
  , logger = require('../../../../../logger')

module.exports = function (r) {
  r.route('/account/email')
  .put(authorizeUser, function(req, res, next) {
    var email = req.body.email;
    var token = req.body.token;
    if (email) {
      var token = Math.random().toString(16).substring(2)
      req.user.unverifiedEmail = email;
      req.user.unverifiedEmailToken = token;
      req.user.save(function(err) {
        if (err) return next(err);
        var host = req.protocol+'://'+req.get('host')
        req.user.sendVerificationEmail({
          url: host+'/verify_email?token='+token
        }, function(err) {
          if (err) return next(err);
          else return res.status(204).end();
        })
      })
    } else if (token) {
      if (req.user.unverifiedEmailToken === token) {
        var email = req.user.unverifiedEmail
        req.user.update({
          email: email,
          unverifiedEmail: null,
          unverifiedEmailToken: null
        }, function(err) {
          if (err) return next(err);
          res.json({ valid: true, email: email })
        });
      } else {
        res.json({ valid: false })
      }
    } else {
      res.status(304).end();
    }
  })
}
