var product = require('../product')

/*
 * Calculate the additional balance based on the time between the
 * instance's 'balanceMovedAt' or 'turnedOnAt' (whichever is most recent) 
 * until its 'turnedOffAt' or now (whichever is least recent)
 * with respect to the price indicated in the product manifest.
 */
module.exports = function (instance) {
  if (instance.turnedOnAt || instance.balanceMovedAt) {
    var from = ensureDate(mostRecent, instance.turnedOnAt, instance.balanceMovedAt)
    var to = ensureDate(leastRecent, instance.turnedOffAt, new Date())
    var diff = to - from;
    return product.pricePerHour * millisecondsToHours(diff);
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
  var hours = seconds / 60;
  return hours;
}

function mostRecent(a, b) {
  return a > b ? a : b
}

function leastRecent(a, b) {
  return a < b ? a : b
}
