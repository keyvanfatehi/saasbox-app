var Promise = require('bluebird')
  , logger = require('../../logger')
  , cf = require('../../server/dns')
  , dns = require('dns')

module.exports = function(options) {
  return new Promise(function(resolve, reject) {
    dns.lookup(options.fqdn, function(err, ip) {
      if (ip === options.ip) {
        logger.info(options.fqdn+' already resolves to '+ip)
      } else {
        cf.addRecord(options.fqdn, options.ip, function(err) {
          if (err) return reject(err);
          else {
            logger.info(options.fqdn+' now resolves to '+ip)
            resolve();
          }
        })
      }
    })
  }).error(onError).catch(onError)
}
function onError(err) {
  logger.warn('DNS Error: '+err.message)
}
