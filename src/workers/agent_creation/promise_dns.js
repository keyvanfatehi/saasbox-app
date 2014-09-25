var Promise = require('bluebird')
  , dns = require('../../server/dns')

module.exports = function(options) {
  return new Promise(function(resolve, reject) {
    console.log('DNS: ', options)
    dns.addRecord(options.name, options.target, function(err) {
      if (err) return reject(err);
      else return resolve();
    })
  });
}
