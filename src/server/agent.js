var Resource = require('../resource')
  , URI = require('uri-js')

var Agent = function (agentConfig) {
  this.name = agentConfig.name;
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
  },
  defineProduct: function(product, cb) {
    this.route('/drops/'+product.slug, function(options) {
      options.headers['Content-Type'] = 'application/javascript'
    }).post(product.ydm, function(err, res) {
      if (err) cb(err);
      if (res.statusCode === 201) cb(null, res);
      else cb(new Error(res.statusCode+' '+res.body))
    }).end()
  }
}

module.exports = Agent;
