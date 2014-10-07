var Promise = require('bluebird')
  , logger = require('../../logger')
  , dns = require('../../server/dns')

module.exports = function(fqdn) {
  return new Promise(function(resolve, reject) {
    dns.deleteRecord(fqdn, function(err) {
      if (err) return reject(err);
      else {
        logger.info(fqdn+' DNS record removed')
        resolve()
      }
    })
  }).error(onError).catch(onError)
}
function onError(err) {
  logger.warn(err.message)
}
