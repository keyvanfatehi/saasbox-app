module.exports = function (req, res, next) {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401).end();
  }
}
