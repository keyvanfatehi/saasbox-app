var Promise = require('bluebird')
var net = require('net');
var logger = require('../../logger')
var backoff = require('backoff')

module.exports = function(options) {
  return new Promise(function(resolve, reject) {
    var blocking = true;
    var timeout = 2000;
    var fibonacciBackoff = backoff.fibonacci({
      randomisationFactor: 0,
      initialDelay: timeout+1000,
      maxDelay: 10000
    });

    var check = function(number, delay) {
      console.log('checking tcp socket.', options, 'backoff:', number + ' ' + delay + 'ms');
      var client = new net.Socket();
      client.setTimeout(timeout, function() {
        client.destroy();
      })

      client.connect(options.port, options.ip)

      client.on('data', function(data) {
        if (options.pattern.test(data.toString())) {
          blocking = false;
          client.destroy(); // kill client after server's response
          fibonacciBackoff.reset()
          resolve()
        }
      });

      client.on('close', function() {
        logger.warn('tcp socket closed')
      });

      client.on('error', function(err) {
        logger.warn('tcp socket error', err.message)
      })
    }

    fibonacciBackoff.on('backoff', function(number, delay) {
      // Do something when backoff starts, e.g. show to the
      // user the delay before next reconnection attempt.
    });

    fibonacciBackoff.on('ready', function(number, delay) {
      // Do something when backoff ends, e.g. retry a failed
      // operation (DNS lookup, API call, etc.). If it fails
      // again then backoff, otherwise reset the backoff
      // instance.
      check(number, delay)
      fibonacciBackoff.backoff();
    });

    fibonacciBackoff.backoff();
  })
}
