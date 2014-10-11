module.exports = function(cents) {
  var dollars = cents / 100;
  return dollars.toFixed(2);
}
