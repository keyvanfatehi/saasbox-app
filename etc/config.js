var jsyaml = require('js-yaml')
var fs = require('fs')
var path = require('path')

module.exports = {
  test: function() {
    var configPath = path.join(__dirname, 'config.yml')
    return jsyaml.load(fs.readFileSync(configPath))
  },
  production: function() {
    return require('/etc/saasbox/config.js')
  }
}[(process.env.CONFIG_ENV || process.env.NODE_ENV) === 'production' ? 'production' : 'test']()
