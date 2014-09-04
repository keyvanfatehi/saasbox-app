var Agent = require('../agent')

var authorizeUser = function (req, res, next) {
  req.user = {}
  next()
}

var initializeInstance = function (req, res, next) {
  req.user.instance = {
    slug: 'strider',
    agent: 'http://localhost:4000',
    namespace: 'myuser' 
    //agent: 'https://agency.knban.com'
  }
  next()
}

module.exports = function (r) {
  r.route('/instance')

  .all(authorizeUser)

  .all(initializeInstance)

  .get(function (req, res, next) {
    var agent = new Agent()
    agent.perform('inspect', req.user.instance, function(err, ares) {
      if (err) {
        res.status(500).json({ status: 'errored: '+err.message });
      } else {
        res.status(200).json({
          status: ares.body.State.Running ? 'on' : 'off'
        })
      }
    })
  })

  .put(function(req, res, next) {
    var agent = new Agent()
    agent.perform('install', req.user.instance, function(err, ares) {
      // use ares to do some other shit like proxy stuff
      res.status(204).end()
    })
  })
}
