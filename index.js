module.exports = {
  config    : require('./etc/config'),
  models    : require('./src/server/models'),
  io        : require('./src/server/socketio'),
  dns       : require('./src/server/dns'),
  redis     : require('./src/redis'),
  products  : require('./products'),
  ejs       : require('ejs'),
  fs        : require('fs'),
  _         : require('lodash'),
  moment    : require('moment')
}
