var logger = require('../logger')
  , express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , cors = require('./middleware/cors')
  , browserify = require('./middleware/browserify')
  , lessMiddleware = require('less-middleware')
  , expressLayouts = require('express-ejs-layouts')
  , engines = require('consolidate')
  , api_v1 = require('./routers/api/v1')
  , web_router = require('./routers/web')
  , session = require('express-session')
  , sessionConfig = require('./session_config')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , config = require('../../etc/config')
  , models = require('./models')

if (process.env.NODE_ENV !== "production") {
  app.use(function (req, res, next) {
    logger.info(req.method, req.path, (req.body ? req.body : ''));
    next();
  });
}

// authentication
var Account = models.Account;
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// database
mongoose.connect(config.mongodb);
mongoose.connection.on('error', logger.error.bind(logger, 'err '+config.mongodb));

// settings
app.engine('.ejs', engines.ejs);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/default.ejs');
app.disable('x-powered-by');

// middleware
app.use('/js/bundle.js', browserify.mainBundle);
app.use('/js/admin.js', browserify.adminBundle);
app.use(lessMiddleware(__dirname + '/../../public'));
app.use(express.static(__dirname + '/../../public'));
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors);
app.use('/api/v1/', cors, bodyParser.json(), api_v1);
app.use(expressLayouts)
app.use('/', bodyParser.urlencoded({ extended: false }), web_router);

module.exports = app;
