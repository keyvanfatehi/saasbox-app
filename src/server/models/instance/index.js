var mongoose = require('mongoose')
  , relationship = require('mongoose-relationship')
  , schema = require('./schema')

schema.plugin(relationship, { relationshipPathName: ['account'] });  

module.exports = mongoose.model('Instance', schema);
