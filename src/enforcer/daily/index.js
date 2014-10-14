/* daily task
  - go through each account
    - has an unpaid balance and billing has been not ok 7 days or more
      - flag standing = 'bad'
    - go through each instance
      - move instance balance into account balance
      - if billing not ok
        - if good account standing
          - send email that this instance will be deleted if billing is not fixed within X days
        - if bad standing
          - delete instance
          - email that the instance has been destroyed
      - (later) if using too much resources, suggest upgrade unless already suggested
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
