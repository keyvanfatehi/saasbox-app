var authorizeUser = function (req, res, next) {
  req.user = {}
  next()
}

var initializeInstance = function (req, res, next) {
  req.user.instance = { status: 'off' }
  next()
}

module.exports = function (r) {
  r.route('/instance')
  .all(authorizeUser)
  .all(initializeInstance)
  .get(function (req, res, next) {
    res.status(200).json(req.user.instance)
  });
}
