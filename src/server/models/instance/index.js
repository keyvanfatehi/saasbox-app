var mongoose = require('mongoose')
  , relationship = require('mongoose-relationship')
  , schema = require('./schema')

schema.methods = require('./methods')
schema.statics = require('./statics')

schema.plugin(relationship, { relationshipPathName: ['account'] });  

module.exports = mongoose.model('Instance', schema);
