var nautical = require('nautical')

module.exports = function(config) {
  var client = nautical.getClient(config)
  return {
    create: function(spec, cb) {
      //cbnew Error('how do i create a vps in DO')
      cb(null, {
        ip: "127.0.0.1"
      })
    }
  }
}
