var logger = require('winston')
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });

var async = require('async')
  , config = require('./etc/config')
  , app = require(__dirname+'/src/server/app.js')
  , port = process.env.PORT || config.port || 4000
  
require('http').Server(app).listen(port, '0.0.0.0');
logger.info("listening on http://0.0.0.0:"+port);
