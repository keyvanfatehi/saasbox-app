var logger = require('winston')
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });

var config = require('./etc/config')
  , async = require('async')
  , Agent = require('./src/server/agent')
  , app = require(__dirname+'/src/server/app.js')
  , port = process.env.PORT || config.port || 4000
  
function seedAgent(name, cb) {
  var agentConfig = config.agents[name]
  var product = require('./product')
  var agent = new Agent(name, agentConfig)
  logger.info("seeding "+product.slug+" on "+agent.name)
  agent.defineProduct(product, function(err) {
    if (err && err.syscall === 'connect')
      logger.error("cannot connect to "+agent.url)
    cb(err)
  })
}

async.each(Object.keys(config.agents), seedAgent, function(err) {
  if (err) throw err;
  require('http').Server(app).listen(port, '0.0.0.0');
  logger.info("listening on http://0.0.0.0:"+port);
})
