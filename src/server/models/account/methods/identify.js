var analytics = require('../../../../analytics')

module.exports = function() {
  analytics.identify({
    userId: this._id.toString(),
    traits: {
      username: this.username,
      email: this.email || this.unverifiedEmail,
      loginCount: this.logins,
      isBillingOk: this.isBillingOk()
    }
  })
}
