var Agent = require('../../server/agent')
  , logger = require('../../logger')
  , Promise = require('bluebird')

module.exports = function(instance) {
  return new Promise(function(resolve, reject) {
    var agent = new Agent(instance.agent);
    instance.performInstall(agent, function(err, response) {
      if (err) {
        logger.error(err.message) 
        reject(err);
      } else resolve(instance)
    })
  })
}
