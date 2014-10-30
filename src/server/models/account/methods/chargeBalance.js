var Promise = require('bluebird')
var Billing = require('../../../billing');

module.exports = function () {
  var account = this;
  return new Promise(function(resolve, reject) {
    var provider = Billing['stripe'];
    var id = account.stripeCustomerId;
    var cents = account.balance;
    if (cents <= 0) return resolve(null);
    var charge = provider.createCharge(cents, id)
    if (charge) {
      // is there a success check ?
      // i think it just throws if charge fails, idk
      account.balance -= cents;
      account.standing = 'good'
      return resolve(account.saveAsync())
    } else {
      return reject(new Error('Charge failed?'));
    }
  });
}
