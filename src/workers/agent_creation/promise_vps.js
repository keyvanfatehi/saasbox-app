var Promise = require('bluebird')
  , config = require('../../../etc/config')
  , logger = require('../../logger')
  , cloudProviders = require('./cloud_providers')

module.exports = function (job, progress) {
  return function() {
    return new Promise(function(resolve, reject) {
      var cloudProvider = job.data.cloudProvider
      var apiConfig = config.cloud_providers[cloudProvider]
      var api = cloudProviders[cloudProvider](apiConfig)
      logger.info('creating vps for instance', job.instance._id.toString())
      api.createServer(job, progress, config.ssh_public_key, function(err, agent) {
        if (err) reject(err);
        else resolve(agent);
      })
    })
  }
}
