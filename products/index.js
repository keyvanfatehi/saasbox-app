var _ = require('lodash')

var all = {
  sentry: require('./sentry'),
  strider: require('./strider')
}

module.exports = _.where(all, { inDevelopment: undefined })
