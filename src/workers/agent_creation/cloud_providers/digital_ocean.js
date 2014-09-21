var nautical = require('nautical')

module.exports = function(config) {
  var client = nautical.getClient(config)
  return {
    create: function(spec, cb) {
      console.log('ok create a vm', spec);
    }
  }
}
