var jsyaml = require('js-yaml')
var fs = require('fs')
var path = require('path')
var env = require('./env')

var getConfigPath = {
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
}[env];

var loadYamlConfig = function() {
  var configPath = getConfigPath()
  return jsyaml.load(fs.readFileSync(configPath)) 
}

var config = loadYamlConfig()

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

module.exports = config
