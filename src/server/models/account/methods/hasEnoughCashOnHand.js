module.exports = function(cents) {
  return (this.balance + cents) < 0;
}
