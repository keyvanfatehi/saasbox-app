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
        if (opts && opts.buffer) {
          var body = '';
          res.on('data', function(data) {
            body += data.toString();
          });
          res.on('end', function() {
            res.body = body;
            cb(null, res);
          })
        } else {
          cb(null, res);
        }
      })
    }
  }
}
