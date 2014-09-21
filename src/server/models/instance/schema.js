var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId

module.exports = new mongoose.Schema({
  slug: String,
  fqdn: String,
  size: Object,
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
