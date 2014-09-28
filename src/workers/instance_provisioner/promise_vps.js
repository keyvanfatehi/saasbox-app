var Promise = require('bluebird')
  , config = require('../../../etc/config')
  , cloudProviders = require('./cloud_providers')
  , fs = require('fs')
  , path = require('path')
  , appRoot = path.join(__dirname, '..', '..', '..')
  , pubKeyPath = path.join(appRoot, config.ssh.publicKeyPath)

module.exports = function(options) {
  return function(instance) {
    return new Promise(function(resolve, reject) {
      var cloud = instance.cloudProvider
      var apiConfig = config.cloud_providers[cloud]
      var api = cloudProviders[cloud](apiConfig)

      if (instance.agent.public_ip) {
        return resolve(instance.agent.public_ip)
      } else {
        fs.readFile(pubKeyPath, function(err, pubKey) {
          if (err) return reject(err);
          api.createServer(instance, pubKey.toString(), options, function(err, instance) {
            if (err) return reject(err);
            resolve(instance.agent.public_ip)
          })
        })
      }
    })
  }
}
