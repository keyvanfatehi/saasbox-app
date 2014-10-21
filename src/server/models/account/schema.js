var mongoose = require('mongoose')
  , trial = require('../../../trial') 
  , ObjectId = mongoose.Schema.Types.ObjectId

module.exports = new mongoose.Schema({
  username: String,
  password: String,
  logins: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0.0 - trial.freeMoney
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  daysUntilBadStanding: {
    type: Number,
    default: 7
  },
  standing: {
    type: String,
    default: 'good'
  },
  email: String,
  unverifiedEmail: String,
  unverifiedEmailToken: String,
  passwordRecoveryToken: String,
  stripeCustomerId: String,
  creditCardInfo: Object,
  instances: [{
    type: ObjectId,
    ref: 'Instance',
    childPath: 'account'
  }],
  createdAt: {
    type: Date,
    default: function() {
      return new Date();
    }
  }
})
