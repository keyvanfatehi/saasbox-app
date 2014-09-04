var http = require('http')

var Resource = function(scope, route, host, port) {
  this.scope = scope;
  this.route = route;
  this.host = host;
  this.port = port;
}

Resource.prototype = {
  get: function(cb) {
    return this.request('GET', this.route, {}, cb)
  },
  put: function(input, cb) {
    var req = null;
    var write = null;
    var headers = {}
    if (input) {
      if (typeof input === "object") {
        headers['Content-Type'] = 'application/json'
        write = function() { req.write(JSON.stringify(input)) }
      } else {
        write = function() { req.write(input) }
      }
    }
    req = this.request('PUT', this.route, headers, cb)
    if (write) write()
    return req;
  }
}

Resource.prototype.request = function(method, route, headers, cb) {
  if (this.scope) cb = cb.bind(this.scope)
  return http.request({
    method: method,
    path: route,
    headers: headers,
    host: this.host,
    port: this.port
  }, function(res) {
    var content_type = res.headers['content-type']
    if (content_type && content_type.match(/json/)) {
      handleJSONResponse(res, cb)
    } else {
      cb(null, res);
    }
  })
}

function handleJSONResponse(res, cb) {
  var body = '';
  res.on('data', function(data) {
    body += data.toString();
  });
  res.on('end', function() {
    res.body = JSON.parse(body);
    cb(null, res);
  })
}

module.exports = Resource
