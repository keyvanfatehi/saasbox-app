var analytics = require('../../../../analytics')

module.exports = function(event, data) {
  analytics.track( {
    userId: this._id.toString(),
    event: event,
    properties: data
  })
}
