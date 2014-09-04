var Resource = require('../resource')
  , URI = require('uri-js');

var Agent = function (options) {
  this.user = options.user;
  this.instance = this.user.instance;
  var uri = URI.parse(this.instance.agent);
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
      namespace: this.user.namespace
    }, function(err, res) {
      cb(err, res);
    }).end()
  }
}

module.exports = Agent;
