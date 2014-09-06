/*
 * Return the new account balance
 */
var getInstanceBalance = require('./instance_balance')

module.exports = function (account) {
  // get the balance for any currently running instance
  var instanceBalance = getInstanceBalance(account.instance) || 0
  // move it to the account balance
  return account.balance + instanceBalance;
}
