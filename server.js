var logger = require('winston')
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });

var config = require('./etc/config')
  , async = require('async')
  , Agent = require('./src/server/agent')
  , app = require(__dirname+'/src/server/app.js')
  , port = process.env.PORT || config.port || 3000
  
function seedAgent(agentConfig, cb) {
  var product = require('./product')
  var agent = new Agent(agentConfig)
  logger.info("seeding "+product.slug+" on "+agent.name)
  agent.defineProduct(product, cb)
}

async.each(config.agents, seedAgent, function(err) {
  if (err) throw err;
  require('http').Server(app).listen(port, '0.0.0.0');
  logger.info("listening on http://0.0.0.0:"+port);
})
