var logger = require('../logger')

module.exports = {
  daily: function() {
    logger.info('daily enforcement online')
  },
  monthly: function() {
    logger.info('monthly enforcement online')
  }
}
