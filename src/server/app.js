var logger = require('winston')
  , express = require('express')
  , app = express()
  , browserify = require('browserify-middleware')
  , bodyParser = require('body-parser')
  , cors = require('./middleware/cors')

app.use('/js/bundle.js', browserify(__dirname+'/../client/app.js', {
  transform: [ 'reactify', 'envify' ]
}));

app.use(express.static(__dirname + '/../../public'));

//var session = require('express-session');
//var RedisStore = require('connect-redis')(session);
//
//app.use(session({
//  store: new RedisStore(options),
//  secret: 'keyboard cat'
//}));

app.use(cors);
app.use(bodyParser.json({limit: '10mb'}));

if (process.env.NODE_ENV === "development") {
  logger.info('development mode');

  app.use(function (req, res, next) {
    logger.info(req.method, req.path, req.body );
    next();
  });
}

app.use('/api/v1/', require('./routes'));

module.exports = app;
