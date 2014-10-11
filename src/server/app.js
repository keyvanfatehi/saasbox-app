var logger = require('../logger')
  , express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , mw = require('./middleware')
  , lessMiddleware = require('less-middleware')
  , expressLayouts = require('express-ejs-layouts')
  , engines = require('consolidate')
  , routers = require('./routers')
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

// global default locals
app.locals.title = config.app_title

// middleware
app.use('/js/bundle.js', mw.browserify.mainBundle);
app.use('/js/admin.js', mw.browserify.adminBundle);
app.use(lessMiddleware(__dirname + '/../../public'));
app.use(express.static(__dirname + '/../../public'));
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
app.use(mw.cors);
Object.keys(routers.api).forEach(function(version) {
  app.use('/api/'+version+'/',
          mw.cors, bodyParser.json(),
          routers.api[version]);
})
app.use(expressLayouts)
Object.keys(routers.web).forEach(function(key) {
  app.use('/',
          bodyParser.urlencoded({ extended: false }),
          mw.setWebLocals,
          mw.flash(),
          routers.web[key]);
})

module.exports = app;
