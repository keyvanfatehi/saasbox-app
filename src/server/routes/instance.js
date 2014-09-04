var Agent = require('../agent')

var authorizeUser = function (req, res, next) {
  req.user = { namespace: 'myuser' }
  next()
}

var initializeInstance = function (req, res, next) {
  req.user.instance = {
    status: 'off',
    slug: 'strider',
    agent: 'http://localhost:4000'
  }
  next()
}

module.exports = function (r) {
  r.route('/instance')

  .all(authorizeUser)

  .all(initializeInstance)

  .get(function (req, res, next) {
    res.status(200).json(req.user.instance)
  })

  .put(function(req, res, next) {
    var agent = new Agent({ user: req.user })
    agent.install(function() {
      res.status(204).end()
    })
  })
}
