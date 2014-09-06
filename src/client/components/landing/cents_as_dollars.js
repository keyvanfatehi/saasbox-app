module.exports = function(cents) {
  var dollars = cents / 100;
  return dollars < 0.00001 ? 0 : dollars.toFixed(2);
}
