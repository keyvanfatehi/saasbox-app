var Resource = require('../resource')
  , URI = require('uri-js');

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

module.exports = Agent;
