var logger = require('winston')
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });

var async = require('async')
  , config = require('./etc/config')
  , products = require('./products')
  , Agent = require('./src/server/agent')
  , app = require(__dirname+'/src/server/app.js')
  , port = process.env.PORT || config.port || 4000
  
async.each(Object.keys(config.agents), function(agentName, agentSeeded) {
  var agent = new Agent(agentName, config.agents[agentName])
  logger.info('attempting to seed '+agent.name+ ' ('+agent.url+')');
  async.each(Object.keys(products), function(productName, productSeeded) {
    var product = products[productName]
    agent.defineDrop(product.slug, {}, function(err) {
      var prefix = '['+agent.name+'|'+product.slug+']';
      if (err) {
        logger.error(prefix+' fail ('+agent.url+') '+err.message);
      } else {
        logger.info(prefix+' ok');
      }
      productSeeded(err)
    })
  }, agentSeeded)
}, function(err) {
  require('http').Server(app).listen(port, '0.0.0.0');
  logger.info("listening on http://0.0.0.0:"+port);
})
