module.exports = {
  username: String,
  password: String,
  instances: Object,
  balance: {
    type: Number,
    default: 0.0
  },
  email: String,
  unverifiedEmail: String,
  unverifiedEmailToken: String,
  stripeCustomerId: String,
  creditCardInfo: Object
}
