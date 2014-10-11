module.exports = function() {
  if (this.unverifiedEmail) {
    this.email = this.unverifiedEmail
    this.unverifiedEmail = null
    this.unverifiedEmailToken = null
  }
  return this;
}
