var Promise = require('bluebird')
  , logger = require('../../logger')
  , dns = require('../../server/dns')

module.exports = function(options) {
  return new Promise(function(resolve, reject) {
    dns.addRecord(options.fqdn, options.ip, function(err) {
      if (err) return reject(err);
      else {
        logger.info(options.fqdn+' now resolves to '+options.ip)
        resolve();
      }
    })
    resolve()
  }).error(onError).catch(onError)
}
function onError(err) {
  logger.warn(err.message)
}
