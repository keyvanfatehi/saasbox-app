var models = require('../../server/models')
  , logger = require('../../logger')
  , Account = models.Account
  , fn = require('require-directory')(module)

module.exports = {
  cronTime: '00 00 03 01 * *',
  humanTime: 'every 1st of the month at 03:00:00 AM',
  onTick: function(cb) {
    logger.info("Monthly enforder ticked")
    cb();
  }
}
