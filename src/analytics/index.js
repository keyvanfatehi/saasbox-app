var analytics = null;

if (process.env.NODE_ENV === 'production') { 
  var Analytics = require('analytics-node')
    , writeKey = require('../../etc/analytics.pub')

  analytics = new Analytics(writeKey, {
    flushAt: 20,
    flushAfter: 10000
  });
} else {
  analytics = require('./stub')
}

module.exports = analytics
