var common = require('saasbox-common')
var path = require('path')

var config = common.loadYamlFile({
  development: function() {
    return path.join(__dirname, 'config.yml')
  },
  test: function() {
    return path.join(__dirname, 'config.yml')
  },
  staging: function() {
    return '/etc/saasbox/config.yml'
  },
  production: function() {
    return '/etc/saasbox/config.yml'
  }
}[common.env]())

/* if we're testing or devving, we dont want to fuck with the production DNS records,
 * to handle this, we compute a developer identity on this machine from the mac address 
 * and provide this through config._subdomain_prefix */
if (process.env.NODE_ENV !== 'production') {
  var md5 = require('crypto').createHash('md5')
  require('getmac').getMac(function(err, macAddress){
    if (err) throw err;
    var str = md5.update(macAddress).digest("hex")
    config.subdomain_prefix = 'dev-'+str.substring(28)+'-'
  });
}

if (process.env.NODE_ENV === 'test') {
  config.mongodb = 'mongodb://localhost/saasbox-test'
}

module.exports = config;
