var logger = require('winston')
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });

var app = require(__dirname+'/src/server/app.js');
var port = process.env.PORT || 3000;
require('http').Server(app).listen(port, '0.0.0.0');
logger.info("listening on http://0.0.0.0:"+port);
