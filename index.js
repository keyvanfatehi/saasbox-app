module.exports = {
  analytics : require('./src/analytics'),
  logger    : require('./src/logger'),
  config    : require('./etc/config'),
  models    : require('./src/server/models'),
  io        : require('./src/server/socketio'),
  dns       : require('./src/server/dns'),
  redis     : require('./src/redis'),
  products  : require('./products'),
}
