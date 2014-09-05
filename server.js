var dotenv = require('dotenv');
dotenv.load();

var logger = require('winston')
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });

var app = require(__dirname+'/src/server/app.js');
var port = process.env.PORT || 3000;

logger.info('seeding the product...')
var product = require('./product')

var Agent = require('./src/server/agent')
var agent = new Agent();

agent.route('/drops/'+product.slug, function(options) {
  options.headers['Content-Type'] = 'application/javascript'
  options.scheme = "http"
  options.host = "localhost"
  options.port = "4000"
}).post(product.ydm, function(err, res) {
  if (err)
    throw new Error('Failed to seed '+product.slug+': '+err.message)
}).end()

require('http').Server(app).listen(port, '0.0.0.0');
logger.info("listening on http://0.0.0.0:"+port);
