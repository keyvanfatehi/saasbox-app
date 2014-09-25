var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId

module.exports = new mongoose.Schema({
  cloudProvider: String,
  slug: String,
  fqdn: String,
  size: Object,
  region: String,
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
