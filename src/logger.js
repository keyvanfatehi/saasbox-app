var winston = require('winston')
  , config = require('../etc/config')
  , Papertrail = require('winston-papertrail').Papertrail

var papertrailTransport = function() {
  return new Papertrail({
    host: config.papertrail.host,
    port: config.papertrail.port,
    hostname: require('os').hostname(),
    program: require('path').basename(process.argv[1]),
    logFormat: function(level, message) {
      return level+': '+message
    }
  })
}

var consoleColorTransport = function() {
  return new winston.transports.Console({
    colorize: true
  })
}

var transports = []
if (process.env.NODE_ENV === 'production') {
  console.log('Logging to papertrail!')
  transports.push(papertrailTransport())
} else if (process.env.NODE_ENV === 'test') {
  // no logger in test
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
