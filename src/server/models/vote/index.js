var mongoose = require('mongoose')
  , schema = require('./schema')

module.exports = mongoose.model('Vote', schema);
