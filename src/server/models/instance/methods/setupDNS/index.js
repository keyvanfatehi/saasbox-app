var Promise = require('bluebird')
  , logger = require('../../../../../logger')
  , dns = require('../../../../dns')

function promiseAddRecord(opts) {
  return new Promise(function(resolve, reject) {
    dns.addRecord(opts.fqdn, opts.ip, function(err) {
      if (err) return reject(err);
      else {
        logger.info(opts.fqdn+' now resolves to '+opts.ip)
        resolve(null)
      }
    })
  })
}

module.exports = function(cb) {
  var ip = this.agent.public_ip;
  return Promise.map([
    { fqdn: this.agent.fqdn, ip: ip },
    { fqdn: this.fqdn, ip: ip }
  ], promiseAddRecord).then(function() {
    cb(null)
  }).error(cb).catch(cb)
}
