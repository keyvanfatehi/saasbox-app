var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId

module.exports = new mongoose.Schema({
  cloudProvider: String,
  slug: String,
  fqdn: String,
  name: String,
  size: Object,
  region: String,
  turnedOnAt: Date,
  turnedOffAt: Date,
  notes: Object,
  agent: {
    type: Object,
    default: {}
  },
  account: {
    type: ObjectId,
    ref: 'Account',
    childPath: 'instances'
  }
})
