/*
 * Return the new account balance
 */
var getInstanceBalance = require('./instance_balance')
var products = require('../products')

module.exports = function (account, slug, instance) {
  var product = products[slug]
  // get the balance for any currently running instance
  var instanceBalance = getInstanceBalance(instance, product.centsPerHour) || 0
  // move it to the account balance
  return account.balance + instanceBalance;
}
