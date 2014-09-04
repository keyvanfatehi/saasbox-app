var Resource = require('../resource')
  , URI = require('uri-js');

var Agent = function () {}

function setAuthToken(options) {
  options.headers['X-Auth-Token'] = process.env.AGENT_API_SECRET
}

Agent.prototype = {
  route: function(route) {
    return new Resource(this, '/api/v1'+route, this.optionMutator)
  },
  setInstance: function(instance) {
    this.instance = instance
    var uri = URI.parse(this.instance.agent);
    this.optionMutator = function(options) {
      options.scheme = uri.scheme
      options.host = uri.host
      options.port = uri.port
      setAuthToken(options)
      return options
    }
  },
  perform: function(action, instance, cb) {
    this.setInstance(instance)
    var req = this.route('/drops/'+this.instance.slug+'/'+action).post({
      namespace: instance.namespace
    }, function(err, res) {
      if (err) cb(err);
      else if (res.statusCode === 200) {
        if (res.body.error) cb(new Error(res.body.error));
        else cb(null, res);
      } else cb(new Error('bad status code '+res.statusCode));
    }).end()
  }
}

module.exports = Agent;
