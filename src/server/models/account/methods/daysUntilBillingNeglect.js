var moment = require('moment')

module.exports = function() {
  return 7 - moment().diff(this.billingBadSince, 'days')
}
