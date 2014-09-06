var logger = require('winston')
  , express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , cors = require('./middleware/cors')
  , browserify = require('./middleware/browserify')
  , engines = require('consolidate')
  , api_v1 = require('./routers/api/v1')
  , sessions = require('./sessions')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , config = require('../../etc/config')

if (process.env.NODE_ENV === "development") {
  logger.info('development mode');
  app.use(function (req, res, next) {
    logger.info(req.method, req.path, req.body );
    next();
  });
}

// passport config
var Account = require('./models/account');
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect(config.mongodb);
mongoose.connection.on('error', logger.error.bind(logger, 'err '+config.mongodb));

app.use('/js/bundle.js', browserify);
app.use(express.static(__dirname + '/../../public'));
app.use(sessions(mongoose.connections[0]))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors);
app.use('/api/v1/', cors, bodyParser.json(), api_v1);
app.use('/', bodyParser.urlencoded({ extended: false }), require('./routers/web'));
app.engine('haml', engines.haml);
app.set('views', __dirname + '/views');
app.set('view engine', 'haml');
app.disable('x-powered-by');
module.exports = app;
