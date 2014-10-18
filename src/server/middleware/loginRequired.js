var analytics = require('../../analytics')

module.exports = {
  requireUser: function (req, res, next) {
    if (req.user) {
      next()
    } else {
      req.flash('error', 'You must be logged in to see that page')
      req.session.loggedInRedirect = req.originalUrl
      res.redirect('/login')
    }
  },
  afterLogin: function(req, res, next) {
    var redirect = req.session.loggedInRedirect
    req.session.loggedInRedirect = null;
    ++req.user.logins
    req.user.identify()
    req.user.track('Logged In')
    req.user.saveAsync().then(function() {
      res.redirect(redirect || '/');
    }).error(next).catch(next)
  }
}
