var logger = require('../../logger')

module.exports = function(err, req, res, next) {
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
  logger.error(err.message, logData)
  res.status(500)
  console.log(req.url);
  if (/^\/api\/v\d/.test(req.url)) {
    res.json({ error: "Internal server error" })
  } else {
    res.render('internal_error');
  }
}
