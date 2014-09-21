var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId

module.exports = new mongoose.Schema({
  slug: String,
  size: Object,
  fqdn: String,
  agentConfig: {
    type: Object,
    default: {}
  },
  ready: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  account: { type: ObjectId, ref: 'Account', childPath: 'instances' },
})
