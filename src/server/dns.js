var config = require('../../etc/config')
  , zone_name = config.zone

function subdomain(slug, username) {
  var prefix = config.subdomain_prefix ? config.subdomain_prefix : ''
  return prefix+slug+'-'+username
}

function fqdn(subdomain) {
  return subdomain+'.'+zone_name
}

var client = require('mailinabox-dns-client')({
  host: config.dns.host,
  email: config.dns.email,
  password: config.dns.password
})

module.exports = {
  fqdn: fqdn,
  subdomain: subdomain,
  addRecord: client.addRecord,
  deleteRecord: client.deleteRecord
}
