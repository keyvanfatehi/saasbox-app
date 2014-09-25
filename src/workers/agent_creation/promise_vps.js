var Promise = require('bluebird')

module.exports = function (cloud, ssh_public_key) {
  return function(instance) {
    return new Promise(function(resolve, reject) {
      if (instance.agent.public_ip) {
        return resolve(instance.agent)
      } else {
        cloud.createServer(instance, ssh_public_key, function(err, agent) {
          if (err) reject(err);
          else resolve(agent);
        })
      }
    })
  }
}
