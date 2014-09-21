var segmentio = require('./segmentio.js')

module.exports = function(window) {
  if (process.env.NODE_ENV === 'production') {
    segmentio(window, window.document)
  } else {
    window.analytics = {
      identify: function(id, data) {
        console.log('analytics.identify', id, data)
      }
    }
  }
}
