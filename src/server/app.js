var logger = require('winston'),
express = require('express'),
app = express(),
browserify = require('browserify-middleware'),
bodyParser = require('body-parser');

app.use('/js/bundle.js', browserify(__dirname+'/../client/app.js', {
  transform: ['reactify']
}));

app.use(express.static(__dirname + '/../../public'));

// Cross Domain
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Expose-Headers", "X-Filename");
  res.header("Access-Control-Allow-Headers", "Referer, Range, Accept-Encoding, Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
};

app.use(allowCrossDomain);
app.use(bodyParser.json({limit: '10mb'}));
app.use('/api/v1/', require('./routes'));

module.exports = app;
