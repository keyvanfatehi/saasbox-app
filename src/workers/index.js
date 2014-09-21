var logger = require('../logger')
  , processAgentCreation = require('./agent_creation')

module.exports = {
  process: function(Queue) {
    processAgentCreation(Queue)
    logger.info("worker "+process.pid+" processing agent creation jobs")
  }
}
