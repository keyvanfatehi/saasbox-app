/*
 * We are using Mailinabox @ box.pillbox.io as our DNS provider
 */
var config = require('../../etc/config')
  , _ = require('lodash')
  , needle = require('needle')
  , zone_name = config.zone

function subdomain(slug, username) {
  return slug+'-'+username
}

function fqdn(subdomain) {
  return subdomain+'.'+zone_name
}

function reqOpts() {
  return {
    username: config.dns.email,
    password: config.dns.password
  }
}

function urlFor(qname, rtype, value) {
  var url = 'https://'+config.dns.host+'/admin/dns/set'
  url += '/'+qname+'/'+rtype+'/'+value;
  return url;
}

client = {
  fqdn: fqdn,
  subdomain: subdomain,
  addRecord: function(fqdn, ip, cb) {
    var url = urlFor(fqdn, 'a', ip)
    return needle.post(url, '', reqOpts(), cb)
  },
  deleteRecord: function(fqdn, cb) {
    var url = urlFor(fqdn, 'a', '__delete__')
    return needle.post(url, '', reqOpts(), cb)
  }
}

module.exports = client;


/* Test
client.deleteRecord('foobar.pillbox.io', function (err, res) {
  console.log(err, res.body)
})

client.addRecord('foobar.pillbox.io', '127.0.0.1', function (err, res) {
  console.log(err, res.body)
})
*/
