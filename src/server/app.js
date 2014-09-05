var logger = require('winston')
  , express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , cors = require('./middleware/cors')
  , browserify = require('./middleware/browserify')
  , engines = require('consolidate')
  , api_v1 = require('./routers/api/v1')
  , sessions = require('./sessions')

if (process.env.NODE_ENV === "development") {
  logger.info('development mode');
  app.use(function (req, res, next) {
    logger.info(req.method, req.path, req.body );
    next();
  });
}

app.use('/js/bundle.js', browserify);
app.use(express.static(__dirname + '/../../public'));
app.use(sessions)
app.use(cors);
app.use('/api/v1/', cors, bodyParser.json(), api_v1);
app.use('/', require('./routers/web'));
app.engine('haml', engines.haml);
module.exports = app;
