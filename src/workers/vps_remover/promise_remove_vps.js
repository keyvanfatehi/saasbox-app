var Promise = require('bluebird')
  , config = require('../../../etc/config')
  , cloudProviders = require('../../cloud_providers')

module.exports = function(cloud, id) {
  return new Promise(function(resolve, reject) {
    var apiConfig = config.cloud_providers[cloud]
    var api = cloudProviders[cloud](apiConfig)
    api.destroyServer(id, function(err) {
      if (err) return reject(err);
      else return resolve();
    })
  })
}
