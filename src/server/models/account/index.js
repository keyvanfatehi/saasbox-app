var passportLocalMongoose = require('passport-local-mongoose')
  , mongoose = require('mongoose')
  , schema = require('./schema')
  , ObjectId = mongoose.Schema.Types.ObjectId
  , relationship = require('mongoose-relationship')
  , Promise = require('bluebird');

schema.methods = require('./methods')
schema.statics = require('./statics')

schema.plugin(passportLocalMongoose);

schema.plugin(relationship, { relationshipPathName: ['instances'] });  

var Account = mongoose.model('Account', schema);

Promise.promisifyAll(Account);

Promise.promisifyAll(Account.prototype);

module.exports = Account;
