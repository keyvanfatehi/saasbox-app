var logger = require('./src/logger')
  , config = require('./etc/config')
  , app = require(__dirname+'/src/server/app.js')
  , port = process.env.PORT || config.port || 4000
  , cluster = require('./src/cluster')
  , http = require('http')

cluster(function() {
  http.Server(app).listen(port, '0.0.0.0');
  logger.info("listening on http://0.0.0.0:"+port);
});
