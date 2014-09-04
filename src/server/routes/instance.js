var authorizeUser = function (req, res, next) {
  req.user = {}
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

var Resource = require('../../resource')

var URI = require('uri-js');

var Agent = function (instance) {
  this.instance = instance;
  var uri = URI.parse(instance.agent);
  this.optionMutator = function(options) {
    options.scheme = uri.scheme
    options.host = uri.host
    options.port = uri.port
    return options
  }
}

Agent.prototype = {
  route: function(route) {
    return new Resource(this, '/api/v1'+route, this.optionMutator)
  },
  install: function(cb) {
    this.route('/drops/'+this.instance.slug+'/install').post({
      namespace: 'myuser',
      callback_url: 'http://where.i.am/my/receiver?token=mytoken'
    }, function(err, res) {
      cb(err, res);
    }).end()
  }
}

module.exports = function (r) {
  r.route('/instance')

  .all(authorizeUser)

  .all(initializeInstance)

  .get(function (req, res, next) {
    res.status(200).json(req.user.instance)
  })

  .put(function(req, res, next) {
    var agent = new Agent(req.user.instance)
    agent.install(function() {
      res.status(204).end()
    })
  })
}
