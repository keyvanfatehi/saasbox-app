var mongoose = require('mongoose')
  , relationship = require('mongoose-relationship')
  , schema = require('./schema')
  , Promise = require('bluebird')

schema.methods = require('./methods')
schema.statics = require('./statics')

schema.plugin(relationship, { relationshipPathName: ['account'] });  

var Instance = mongoose.model('Instance', schema);

Promise.promisifyAll(Instance);

Promise.promisifyAll(Instance.prototype);

module.exports = Instance
