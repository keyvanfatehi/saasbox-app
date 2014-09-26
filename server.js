var logger = require('./src/logger')
  , config = require('./etc/config')
  , app = require(__dirname+'/src/server/app.js')
  , port = process.env.PORT || config.port || 4000
  , cluster = require('./src/cluster')
  , http = require('http')
  , io = require('./src/server/socketio')

cluster(function() {
  var server = http.Server(app)
  io.listen(server)
  server.listen(port, '0.0.0.0');
  logger.info("listening on http://0.0.0.0:"+port);
});
