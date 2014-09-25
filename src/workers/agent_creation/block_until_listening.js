var Promise = require('bluebird')
var net = require('net');
var logger = require('../../logger')
var backoff = require('backoff')

module.exports = function(options) {
  return new Promise(function(resolve, reject) {
    var blocking = true;
    var fibonacciBackoff = backoff.fibonacci({
      randomisationFactor: 0,
      initialDelay: 1000,
      maxDelay: 120000
    });

    var check = function(number, delay, retry) {
      var client = new net.Socket();
      client.setTimeout(options.timeout, function() {
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
        if (blocking) fail();
      });

      client.on('error', function(err) {
        console.log('error', typeof err)
      })
    }

    fibonacciBackoff.on('backoff', function(number, delay) {
      // Do something when backoff starts, e.g. show to the
      // user the delay before next reconnection attempt.
      logger.info('blocking until tcp socket listening', options);
    });

    fibonacciBackoff.on('ready', function(number, delay) {
      // Do something when backoff ends, e.g. retry a failed
      // operation (DNS lookup, API call, etc.). If it fails
      // again then backoff, otherwise reset the backoff
      // instance.
      check(number, delay, fibonacciBackoff.backoff)
    });

    fibonacciBackoff.backoff();
  })
}
