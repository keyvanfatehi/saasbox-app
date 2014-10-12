var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    match: [ /@/, "Email does not include @" ]
  }
})

schema.path('name').validate(function (value) {
  return value.length < 255
}, 'Name is too long');

schema.path('name').validate(function (value) {
  return value.length > 0
}, 'Name is too short');

schema.path('email').validate(function (value) {
  return value.length < 255
}, 'Email is too long');

schema.path('name').validate(function (value) {
  return value.length > 0
}, 'Name is too short');

module.exports = schema;
