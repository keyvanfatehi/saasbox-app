var http = require('http')

module.exports = function(route) {
  return {
    get: function(cb, opts) {
      return this._request('GET', cb, opts)
    },
    _request: function(method, cb, opts) {
      return http.request({
        method: method,
        path: route,
        headers: {},
      }, function(res) {
        if (res.headers['content-type'].match(/json/)) {
          handleJSONResponse(res, cb)
        } else {
          cb(null, res);
        }
      })
    }
  }
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
