var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId

module.exports = new mongoose.Schema({
  username: String,
  password: String,
  balance: {
    type: Number,
    default: 0.0
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  email: String,
  unverifiedEmail: String,
  unverifiedEmailToken: String,
  stripeCustomerId: String,
  creditCardInfo: Object,
  instances: [{
    type: ObjectId,
    ref: 'Instance',
    childPath: 'account'
  }],
})
