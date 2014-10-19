/* daily task runner
   - future: if using too much resources, suggest upgrade unless already suggested
*/

var models = require('../../server/models')
  , logger = require('../../logger')
  , Account = models.Account
  , fn = require('require-directory')(module)

module.exports = {
  cronTime: '00 30 02 * * *',
  humanTime: 'everyday at 02:30:00 AM',
  onTick: function(cb) {
    logger.info("Daily enforcer ticked")
    Account
    .findAllAndPopulateInstances({})
    .map(fn.evaluateAccount)
    .map(fn.evaluateInstances)
    .then(function() { cb(null) })
    .error(cb)
    .catch(cb)
  }
}
