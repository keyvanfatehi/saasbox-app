var Resource = require('../resource')
  , URI = require('uri-js');

var Agent = function () {}

function setAuthToken(options) {
  options.headers['X-Auth-Token'] = process.env.AGENT_API_SECRET
}

Agent.prototype = {
  route: function(route, optionMutator) {
    return new Resource(this, '/api/v1'+route, function(options) {
      if (optionMutator)
        optionMutator(options)

      setAuthToken(options)
    })
  },
  perform: function(action, instance, cb) {
    var req = this.route('/drops/'+instance.slug+'/'+action, function(options) {
      var uri = URI.parse(instance.agent);
      options.scheme = uri.scheme
      options.host = uri.host
      options.port = uri.port
    }).post({
      namespace: instance.namespace
    }, cb).end()
  }
}

module.exports = Agent;
