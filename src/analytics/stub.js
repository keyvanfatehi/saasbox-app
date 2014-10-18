module.exports = {
  load: function() {
    console.log('analytics.load', arguments)
  },
  identify: function() {
    console.log('analytics.identify', arguments)
  },
  page: function() {
    console.log('analytics.page', arguments)
  },
  track: function() {
    console.log('analytics.track', arguments)
  }
}
