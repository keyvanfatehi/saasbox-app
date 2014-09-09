/*
 * We are using cloudflare as our DNS provider
 */
var config = require('../../etc/config')
  , cloudflare = require('cloudflare')
  , _ = require('lodash')
  , zone_name = config.zone
  , product = require('../../product')

function cf() {
  return cloudflare.createClient(config.cloudflare)
}

function subdomain(username) {
  return product.slug+'-'+username
}

function fqdn(subdomain) {
  return subdomain+'.'+zone_name
}

module.exports = {
  production: function() { return {
    fqdn: fqdn,
    subdomain: subdomain,
    addRecord: function(name, ip, cb) {
      return cf().addDomainRecord(zone_name, {
        type: 'A',
        content: ip,
        name: name
      }, cb)
    },
    deleteRecord: function(name, cb) {
      cf().listDomainRecords(zone_name, function (err, records) {
        if (err) return cb(err);
        var record = _.find(records, { name: name+'.'+zone_name });
        if (record) {
          return cf().deleteDomainRecord(zone_name, record.rec_id, cb)
        } else return cb(new Error('No record', name, zone_name))
      })
    }
  }},
  test: function() { return {
    fqdn: fqdn,
    subdomain: subdomain,
    addRecord: function (name, ip, cb) {
      console.log('DNS Test Stub: addRecord', name, ip)
      cb()
    },
    deleteRecord: function (name, cb) {
      console.log('DNS Test Stub: deleteRecord ', name)
      cb()
    }
  }}
}[process.env.CONFIG_ENV || process.env.NODE_ENV || 'test']()
