var logger = require('winston')
  , express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , cors = require('./middleware/cors')
  , browserify = require('./middleware/browserify')
  , session = require('express-session')
  , RedisStore = require('connect-redis')(session)
  , client = require('./redis')
  , config = require('../../etc/config')

app.use('/js/bundle.js', browserify);

app.use(express.static(__dirname + '/../../public'));

app.use(session({
  store: new RedisStore({
    redis: client,
    ttl: 10 * 60 // 10 minute sessions
  }),
  secret: config.secret
}));

app.use(cors);
app.use(bodyParser.json({limit: '1kb'}));

if (process.env.NODE_ENV === "development") {
  logger.info('development mode');

  app.use(function (req, res, next) {
    logger.info(req.method, req.path, req.body );
    next();
  });
}

app.use('/api/v1/', require('./routes'));

module.exports = app;
