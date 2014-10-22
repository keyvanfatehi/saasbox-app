/*
 * monthly task
 * - go through each account
 *   - use stripe to charge the account balance
 *   - if success, set account standing to 'good' and balance to 0
 *   - if failure, remove credit card, send an email asking for billing info
 *     - if has instances, warn that unpaid instances will be kept alive only 7 days
 */
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
