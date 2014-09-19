var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , passportLocalMongoose = require('passport-local-mongoose')
  , Account = new Schema(require('./schema'))

Account.methods = require('./methods')

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
