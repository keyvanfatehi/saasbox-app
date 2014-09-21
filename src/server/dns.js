/*
 * We are using cloudflare as our DNS provider
 */
var config = require('../../etc/config')
  , cloudflare = require('cloudflare')
  , _ = require('lodash')
  , zone_name = config.zone

function cf() {
  return cloudflare.createClient(config.cloudflare)
}

function subdomain(slug, username) {
  return slug+'-'+username
}

function fqdn(subdomain) {
  return subdomain+'.'+zone_name
}

module.exports = {
  fqdn: fqdn,
  subdomain: subdomain,
  addRecord: function(name, ip, cb) {
    return cf().addDomainRecord(zone_name, {
      type: 'A',
      content: ip,
      name: name
    }, cb)
  },
  deleteRecord: function(fqdn, cb) {
    cf().listDomainRecords(zone_name, function (err, records) {
      if (err) return cb(err);
      var record = _.find(records, { name: fqdn });
      if (record) {
        return cf().deleteDomainRecord(zone_name, record.rec_id, cb)
      } else return cb(new Error('No record '+fqdn))
    })
  }
}
