/*
 * Return the new account balance
 */
var getInstanceBalance = require('./instance_balance')
var products = require('../products')

module.exports = function (account) {
  var product = products[account.instance.slug]
  // get the balance for any currently running instance
  var instanceBalance = getInstanceBalance(account.instance, product.centsPerHour) || 0
  // move it to the account balance
  return account.balance + instanceBalance;
}
