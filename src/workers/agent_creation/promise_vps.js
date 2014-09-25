var Promise = require('bluebird')
  , config = require('../../../etc/config')
  , cloudProviders = require('./cloud_providers')

module.exports = function(instance) {
  return new Promise(function(resolve, reject) {
    var cloud = instance.cloudProvider
    var apiConfig = config.cloud_providers[cloud]
    var api = cloudProviders[cloud](apiConfig)

    if (instance.agent.public_ip) {
      return resolve(instance.agent.public_ip)
    } else {
      api.createServer(instance, config.ssh_public_key, function(err, instance) {
        if (err) reject(err);
        else resolve(instance.agent.public_ip)
      })
    }
  })
}
