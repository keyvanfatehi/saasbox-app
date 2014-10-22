var instanceCost = require('./instance_cost')
var products = require('../products')

/*
 * Calculate the balance in cents based on the time between the
 * instance's 'balanceMovedAt' or 'turnedOnAt' (whichever is most recent) 
 * until its 'turnedOffAt' or now (whichever is least recent)
 * with respect to the price per hour
 */
module.exports = function (instance) {
  var product = products[instance.slug]
  var appPremium = product.monthlyPremium || 0
  var totalPremium = instance.size.cents + appPremium
  var centsPerHour = instanceCost(totalPremium).hourly.cents
  if (instance.turnedOnAt || instance.balanceMovedAt) {
    var onAt = null, movedAt = null;

    if (typeof instance.turnedOnAt === 'string')
      onAt = new Date(instance.turnedOnAt);
    else
      onAt = instance.balanceMovedAt

    if (typeof instance.balanceMovedAt === 'string')
      movedAt = new Date(instance.balanceMovedAt);
    else
      movedAt = instance.balanceMovedAt

    var from = ensureDate(mostRecent, instance.turnedOnAt, instance.balanceMovedAt)
    var to = ensureDate(leastRecent, instance.turnedOffAt, new Date())
    var diff = to - from;
    var balance = centsPerHour * millisecondsToHours(diff);

    return balance;
  } else {
    return 0;
  }
}

function ensureDate(fn, a, b) {
  if (a && b) {
    return fn(new Date(a), new Date(b));
  } else {
    if (a) return new Date(a);
    if (b) return new Date(b);
    throw new Error('Received falsey items where at least one date was expected.')
  }
}

function millisecondsToHours(diff) {
  var seconds = diff / 1000;
  var minutes = seconds / 60;
  var hours = minutes / 60;
  return hours;
}

function mostRecent(a, b) {
  return a > b ? a : b
}

function leastRecent(a, b) {
  return a < b ? a : b
}
