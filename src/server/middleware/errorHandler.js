var logger = require('../../logger')

module.exports = function(err, req, res, next) {
  var apiRequest = /^\/api\/v\d/.test(req.url);
  if (err.name === "ValidationError") {
    var messages = []
    for (var key in err.errors)
      messages.push(err.errors[key].message)

    if (apiRequest) {
      req.status(400)
      return res.json({
        error: 'ValidationError',
        messages: messages
      });
    } else {
      messages.forEach(function(message) {
        req.flash('error', message)
      })
      return res.redirect('back')
    }
  } else if (err.name === "ForbiddenError") {
    req.flash('error', 'You must be logged in as an administrator to see that page')
    res.redirect('/login')
  } else {
    var logData = {
      type: 'web',
      url: req.originalUrl,
      method: req.method,
      stack: err.stack,
      user: (req.user ? {
        _id: req.user._id.toString(),
        username: req.user.username,
        email: req.user.email
      } : null)
    }
    logger.error(err.stack, logData)
    res.status(500)
    if (apiRequest) {
      res.json({ error: "Internal server error" })
    } else {
      res.render('internal_error');
    }
  }
}
