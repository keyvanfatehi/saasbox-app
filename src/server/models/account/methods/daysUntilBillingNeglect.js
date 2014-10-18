var moment = require('moment')

module.exports = function() {
  return moment().diff(this.billingBadSince, 'days')+1
}
