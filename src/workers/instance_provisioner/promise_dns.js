var Promise = require('bluebird')
  , logger = require('../../logger')
  , cf = require('../../server/dns')

module.exports = function(options) {
  return new Promise(function(resolve, reject) {
    cf.addRecord(options.fqdn, options.ip, function(err) {
      if (err) return reject(err);
      else {
        logger.info(options.fqdn+' now resolves to '+ip)
        resolve();
      }
    })
  }).error(onError).catch(onError)
}
function onError(err) {
  logger.warn(err.message)
}
