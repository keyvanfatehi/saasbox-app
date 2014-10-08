var _ = require('lodash')

var apps = [
  require('./sentry'),
  require('./strider')
]

var active = _.where(apps, {
  inDevelopment: undefined
})

module.exports = _.zipObject(_.pluck(active, 'slug'), active)
