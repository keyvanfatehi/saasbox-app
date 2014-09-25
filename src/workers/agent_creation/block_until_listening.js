var Promise = require('bluebird')
var net = require('net');

module.exports = function(options) {
  var blocking = true;
  return new Promise(function(resolve, reject) {
    var check = function() {
      var client = new net.Socket();
      client.setTimeout(options.timeout, function() {
        client.destroy();
      })

      client.connect(options.port, options.ip)

      client.on('data', function(data) {
        if (options.pattern.test(data.toString())) {
          blocking = false;
          client.destroy(); // kill client after server's response
          resolve()
        }
      });

      client.on('close', function() {
        if (blocking) check();
      });
    }
    check()
  })
}
