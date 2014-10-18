var analytics = require('../../../../analytics')

module.exports = function() {
  analytics.identify(this._id, {
    username: this.username,
    email: this.email || this.unverifiedEmail,
    loginCount: this.logins,
    isBillingOk: this.isBillingOk()
  })
}
