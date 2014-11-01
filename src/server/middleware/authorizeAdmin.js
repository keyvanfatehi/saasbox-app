module.exports = function (req, res, next) {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    var err = new Error()
    err.name = 'ForbiddenError'
    next(err)
  }
}
