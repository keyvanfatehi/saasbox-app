var winston = module.exports = require('winston')
var config = require('../etc/config')
var prod = process.env.NODE_ENV === 'production'
var os = require('os');

if (prod) {
  // this might have some issues
  // we need to spend time looking more into logging
  // but for now i just want to have logs, so we'll use this
  require('winston-loggly')
  winston.add(winston.transports.Loggly, {
    subdomain: config.loggly.subdomain,
    token: config.loggly.token,
    tags: [os.hostname()],
    json: true,
    timestamp: function() {
      return new Date().toISOString()
    }
  })
} else {
  winston.remove(winston.transports.Console);
  //winston.add(winston.transports.Console, {
  //  colorize: true,
  //  json: true,
  //  timestamp: function() {
  //    return new Date().toISOString()
  //  }
  //});
  winston.add(winston.transports.Console, {
    colorize: true
  })
}
