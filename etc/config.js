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

module.exports = loadYamlConfig()
