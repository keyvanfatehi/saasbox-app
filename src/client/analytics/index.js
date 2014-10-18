var loader = require('./loader.js')
var writeKey = require('../../../etc/analytics.pub');

module.exports = function(window) {
  if (process.env.NODE_ENV === 'production') {
    loader(window, window.document)
  } else {
    window.analytics = require('../../analytics/stub');
  }

  // Load Analytics.js with your key, which will automatically
  // load the tools you've enabled for your account. Boosh!
  window.analytics.load(writeKey);

  // Make the first page call to load the integrations. If
  // you'd like to manually name or tag the page, edit or
  // move this call however you'd like.
  window.analytics.page();
}
