/*
 * We are using cloudflare as our DNS backend
 */
var config = require('../../etc/config')
  , cloudflare = require('cloudflare')
  , _ = require('lodash')

function cf() {
  return cloudflare.createClient(config.cloudflare)
}

module.exports = {
  addRecord: function(name, zone_name, ip, cb) {
    return cf().addDomainRecord(zone_name, {
      type: 'A',
      content: ip,
      name: name
    }, cb)
  },
  deleteRecord: function(name, zone_name, cb) {
    cf().listDomainRecords(zone_name, function (err, records) {
      if (err) return cb(err);
      var record = _.find(records, { name: name+'.'+zone_name });
      if (record) {
        return cf.deleteDomainRecord(zone_name, record.rec_id, cb)
      } else return cb(new Error('No record', name, zone_name))
    })
  }
}
