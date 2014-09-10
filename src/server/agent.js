var URI = require('uri-js')
  , needle = require('needle')
  , fs = require('fs')
  , path = require('path')

var Agent = function (name, agentConfig) {
  this.ip = agentConfig.ip;
  this.domain = agentConfig.domain;
  this.name = name;
  this.url = agentConfig.url;
  this.secret = agentConfig.secret;
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
  perform: function(action, instance, cb) {
    this.defineProduct(instance.slug, function (err) {
      if (err) return cb(err);
      var url = this.url+'/api/v1/drops/'+instance.slug+'/'+action
        , body = JSON.stringify({ namespace: instance.namespace })
      var headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': this.secret
      }
      var options = { headers: headers }
      needle.post(url, body, options, cb)
    });
  },
  defineProduct: function(slug, cb) {
    var url = this.url+'/api/v1/drops/'+slug
    var headers = {
      'X-Auth-Token': this.secret,
      'Content-Type': 'application/javascript'
    }
    var options = { headers: headers }
    var productsPath = path.join(__dirname, '..', '..', 'product');
    var ydm = fs.readFileSync(path.join(productsPath, slug, 'ydm.js'))
    needle.post(url, ydm.toString(), options, function(err, res, body) {
      if (err) return cb(err);
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
    needle.post(url, body, options, cb)
  },
  destroyProxy: function(fqdn, cb) {
    var url = this.url+'/api/v1/proxies/'+fqdn
    var headers = { 'X-Auth-Token': this.secret }
    var options = { headers: headers }
    needle.delete(url, null, options, cb)
  }
}

module.exports = Agent;
