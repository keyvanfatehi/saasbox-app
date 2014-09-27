var URI = require('uri-js')
  , needle = require('needle')
  , getDropSource = require('./get_drop_source')
  , products = require('../../products')

var Agent = function (agentConfig) {
  this.fqdn = agentConfig.fqdn;
  this.ip = agentConfig.public_ip;
  this.url = 'https://'+this.fqdn;
  this.secret = agentConfig.secret;
  this.identifier = this.fqdn+' ('+this.ip+')'
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
  },
  perform: function(action, slug, argv, cb) {
    if (! argv.namespace) return cb(new Error('invalid namespace'));
    var url = this.url+'/api/v1/drops/'+slug+'/'+action
    var body = JSON.stringify(argv)
    var headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': this.secret
    }
    var options = { headers: headers }
    return needle.post(url, body, options, cb)
  },
  /* Deprecated. Load drops directly on the agents via source bundle. */
  defineDrop: function(slug, overrides, cb) {
    var product = products[slug]
    var src = getDropSource(slug, {
      memory: overrides.memory || product.minMemory
    })
    return needle.post(this.url+'/api/v1/drops/'+slug, src, {
      headers: { 'X-Auth-Token': this.secret,
        'Content-Type': 'application/javascript' }
    }, function(err, res, body) {
      if (err) return cb(err);
      console.log('remote drop defined')
      var code = res.statusCode
      if (code === 201) return cb(null, res);
      else cb(new Error(code+' '+body.toString()+'\n\nREQUEST INFO:\nURL: '+url+'\nOPTIONS: '+JSON.stringify(options, null, 4)))
    })
  },
  createProxy: function(fqdn, target, cb) {
    var url = this.url+'/api/v1/proxies/'+fqdn
      , body = JSON.stringify({ target: target })
    var headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': this.secret
    }
    var options = { headers: headers }
    return needle.post(url, body, options, cb)
  },
  destroyProxy: function(fqdn, cb) {
    var url = this.url+'/api/v1/proxies/'+fqdn
    var headers = { 'X-Auth-Token': this.secret }
    var options = { headers: headers }
    return needle.delete(url, null, options, cb)
  }
}

module.exports = Agent;
