var SocketIO = require('socket.io')
  , io = new SocketIO()
  , redis = require('socket.io-redis')
  , config = require('../../etc/config')
  , logger = require('../logger')
  , passportSocketIo = require("passport.socketio")
  , cookieParser = require('cookie-parser')
  , _ = require('lodash')

io.adapter(redis(config.redis))

var sessionConfig = require('./session_config')

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: sessionConfig.key,
  secret: sessionConfig.secret,
  store: sessionConfig.store,
  success: function(data, accept) {
    if (data.user) accept() // Authorize authenticated users
  }
}));

var products = require('../../products')


io.on('connection', function(socket) {
  var user = socket.conn.request.user
  logger.info(user.username+' connected via websocket')
  _.each(products, function(product, slug) {
    var room = slug+'-'+user.username
    socket.join(room)
    logger.info(user.username+' joined room '+room)
  })
})

module.exports = io;
