var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , passportLocalMongoose = require('passport-local-mongoose')

var Account = new Schema({
    username: String,
    password: String,
    instances: Object,
    balance: {
      type: Number,
      default: 0.0
    },
    emailAddress: String,
    emailConfirmed: {
      type: Boolean,
      default: false
    },
    stripeToken: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
