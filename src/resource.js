var http = require('http')

var Resource = function(scope, route, mutateOptions) {
  this.scope = scope;
  this.route = route;
  this.mutate = mutateOptions;
}

Resource.prototype = {
  get: function(cb) {
    return this.request('GET', this.route, {}, cb)
  },
  put: function(input, cb) {
    return requestWithBody('PUT', this, input, cb)
  },
  post: function(input, cb) {
    return requestWithBody('POST', this, input, cb)
  }
}

function requestWithBody(method, resource, input, cb) {
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
  req = resource.request(method, resource.route, headers, cb)
  if (write) write();
  return req;
}

Resource.prototype.request = function(method, route, headers, cb) {
  if (this.scope) cb = cb.bind(this.scope);
  var  options = {
    method: method,
    path: route,
    headers: headers || {}
  }
  if (this.mutate) {
    this.mutate(options)
  }
  // console.log(options)
  return http.request(options, function(res) {
    handleResponse(res, function(body) {
      var content_type = res.headers['content-type']
      if (content_type && content_type.match(/json/)) {
        return JSON.parse(body)
      } else {
        return body
      }
    }, cb)
  })
}

function handleResponse(res, parse, cb) {
  var body = '';
  res.on('data', function(data) {
    body += data.toString();
  });
  res.on('end', function() {
    res.body = parse(body);
    if (res.statusCode >= 400) {
      cb(new Error(res.statusCode+' '+res.body), res)
    } else {
      cb(null, res);
    }
  })
}

module.exports = Resource
