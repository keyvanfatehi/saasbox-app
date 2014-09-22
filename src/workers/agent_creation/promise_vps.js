var Promise = require('bluebird')
  , config = require('../../../etc/config')
  , logger = require('../../logger')
  , cloudProviders = require('./cloud_providers')

module.exports = function (cloudProvider) {
  return function(instance) {
    return new Promise(function(resolve, reject) {
      var apiConfig = config.cloudProviders[cloudProvider]
      var api = cloudProviders[cloudProvider](apiConfig)
      logger.info('creating vps for instance', instance._id.toString())
      api.create(instance.size, function(err, vps) {
        if (err) reject(err);
        else resolve(vps);
      })
    })
  }
}
