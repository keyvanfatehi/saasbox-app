/* daily task runner
   - future: if using too much resources, suggest upgrade unless already suggested
*/


var models = require('../../server/models')
var Account = models.Account;

var fn = require('require-directory')(module)

var Promise = require('bluebird')
module.exports = {
  cronTime: '00 30 02 * * *',
  humanTime: 'everyday at 02:30:00 AM',
  onTick: function(cb) {
    Account
    .findAllAndPopulateInstances({})
    .map(fn.evaluateAccount)
    .map(fn.evaluateInstances)
    .then(function() { cb(null) })
    .error(cb)
    .catch(cb)
  }
}
