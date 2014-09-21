var logger = require('../logger')
  , Queues = require('../queues')
  , agentCreation = require('./agent_creation')

module.exports = {
  process: function() {
    agentCreation(Queues.agentCreation)
    logger.info("worker "+process.pid+" processing agent creation jobs")
  }
}
