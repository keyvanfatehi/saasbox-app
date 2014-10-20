var winston = module.exports = require('winston')
var config = require('../etc/config')

var papertrailTransport = function() {
  var Papertrail = require('winston-papertrail').Papertrail
  var transport = new Papertrail({
    host: config.papertrail.host,
    port: config.papertrail.port,
    hostname: require('os').hostname(),
    program: require('path').basename(process.argv[1]),
    logFormat: function(level, message) {
      return level+': '+message
    }
  })
  return transport
}

var consoleColorTransport = function() {
  var transport = new winston.transports.Console({
    colorize: true
  })
  return transport;
}

var transports = []
if (process.env.NODE_ENV === 'production') {
  console.log('Logging to papertrail!')
  transports.push(papertrailTransport())
} else {
  transports.push(consoleColorTransport())
}

module.exports = new winston.Logger({
  transports: transports,
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  }
})
