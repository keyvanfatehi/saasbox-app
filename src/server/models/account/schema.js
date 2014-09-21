var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId

module.exports = new mongoose.Schema({
  username: String,
  password: String,
  instances: [{ type: ObjectId, ref: 'Instance', childPath: 'account' }],
  balance: {
    type: Number,
    default: 0.0
  },
  email: String,
  unverifiedEmail: String,
  unverifiedEmailToken: String,
  stripeCustomerId: String,
  creditCardInfo: Object
})
