var http = require('http')

var Resource = function(scope, route) {
  this.scope = scope;
  this.route = route;
}

Resource.prototype = {
  get: function(cb) {
    return request('GET', this.route, {}, cb.bind(this.scope))
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
    req = request('PUT', this.route, headers, cb.bind(this.scope)) 
    if (write) write()
    return req;
  }
}


function request(method, route, headers, cb) {
  return http.request({
    method: method,
    path: route,
    headers: headers,
  }, function(res) {
    if (res.headers['content-type'].match(/json/)) {
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
