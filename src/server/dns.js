var config = require('../../etc/config')
  , zone_name = config.zone

var client = require('mailinabox-dns-client')({
  host: config.dns.host,
  email: config.dns.email,
  password: config.dns.password
})

function subdomain(slug, username) {
  return slug+'-'+username
}

function fqdn(subdomain) {
  return subdomain+'.'+zone_name
}

module.exports = {
  fqdn: fqdn,
  subdomain: subdomain,
  addRecord: client.addRecord,
  deleteRecord: client.deleteRecord
}
