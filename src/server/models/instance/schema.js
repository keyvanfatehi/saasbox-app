var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId

module.exports = new mongoose.Schema({
  slug: String,
  size: Object,
  fqdn: String,
  agentConfig: Object,
  account: { type: ObjectId, ref: 'Account', childPath: 'instances' },
})
