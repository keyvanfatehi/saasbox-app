var Promise = require('bluebird')
var net = require('net');

module.exports = function(options) {
  var blocking = true;
  return new Promise(function(resolve, reject) {
    var check = function() {
      console.log('TCPCheck checking', options)
      
      var client = new net.Socket();
      client.setTimeout(options.timeout, function() {
        console.log('TCPCheck timeout')
        client.destroy();
      })

      client.connect(options.port, options.ip, function() {
        console.log('TCPCheck Connected');
      });

      client.on('data', function(data) {
        console.log('TCPCheck Received: ' + data);
        if (options.pattern.test(data.toString())) {
          blocking = false;
          client.destroy(); // kill client after server's response
          resolve()
        }
      });

      client.on('error', function() {
        console.log('TCPCheck Error event');
      })

      client.on('close', function() {
        if (blocking) check();
        console.log('TCPCheck Connection closed');
      });
    }
    check()
  })
}
