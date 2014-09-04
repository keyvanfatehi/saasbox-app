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
        var body = '';
        res.on('data', function(data) {
          body += data.toString();
        });
        res.on('end', function() {
          if (opts && opts.json) {
            res.body = JSON.parse(body);
          } else {
            res.body = body;
          }
          cb(null, res);
        })
      })
    }
  }
}
