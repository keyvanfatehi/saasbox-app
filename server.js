var logger = require('./src/logger')
  , config = require('./etc/config')
  , app = require(__dirname+'/src/server/app.js')
  , cluster = require('./src/cluster')
  , http = require('http')
  , io = require('./src/server/socketio')
  , https = require('https')
  , fs = require('fs')
  , express = require('express')

cluster(function() {
  var port = null, server = null;
  if (config.ssl) {
    port = 443;
    server = https.Server({
      key: fs.readFileSync(config.ssl.keyPath),
      cert: fs.readFileSync(config.ssl.certPath)
    }, app);
    redirect = express()
    redirect.use(function(req,res,next){
      res.writeHead(301, {
        'Location': 'https://'+req.get('host')+req.originalUrl,
        'Expires': new Date().toGMTString()
      });
      res.end();
    });
    http.Server(redirect);
    redirect.listen(80);
    logger.info("redirector listening on http://0.0.0.0:80");
  } else {
    port = process.env.PORT || 4000;
    server = http.Server(app)
  }
  io.listen(server)
  server.listen(port, '0.0.0.0');
  logger.info("application listening on http://0.0.0.0:"+port);
});
