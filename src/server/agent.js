var Resource = require('../resource')
  , URI = require('uri-js');

var Agent = function (agentConfig) {
  this.configure = function(options) {
    var uri = URI.parse(agentConfig.url);
    options.headers['X-Auth-Token'] = agentConfig.secret
    options.scheme = uri.scheme
    options.host = uri.host
    options.port = uri.port
  }
}

Agent.prototype = {
  route: function(route, optionMutator) {
    var self = this;
    return new Resource(this, '/api/v1'+route, function(options) {
      if (optionMutator)
        optionMutator(options)

      self.configure(options)
    })
  },
  perform: function(action, instance, cb) {
    var req = this.route('/drops/'+instance.slug+'/'+action).post({
      namespace: instance.namespace
    }, cb).end()
  }
}

module.exports = Agent;
