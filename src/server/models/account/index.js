var passportLocalMongoose = require('passport-local-mongoose')
  , mongoose = require('mongoose')
  , schema = require('./schema')
  , ObjectId = mongoose.Schema.Types.ObjectId
  , relationship = require('mongoose-relationship')

schema.methods = require('./methods')

schema.plugin(passportLocalMongoose);

schema.plugin(relationship, { relationshipPathName: ['instances'] });  

module.exports = mongoose.model('Account', schema);
