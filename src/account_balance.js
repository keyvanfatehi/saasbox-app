/*
 * Return the new account balance
 */
var getInstanceBalance = require('./instance_balance')
var product = require('../product')

module.exports = function (account) {
  // get the balance for any currently running instance
  var instanceBalance = getInstanceBalance(account.instance, product.centsPerHour) || 0
  // move it to the account balance
  return account.balance + instanceBalance;
}
