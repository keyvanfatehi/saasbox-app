var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId

module.exports = new mongoose.Schema({
  cloudProvider: String,
  slug: String,
  version: String,
  fqdn: String,
  name: String,
  size: Object,
  region: String,
  turnedOnAt: Date,
  balanceMovedAt: Date,
  turnedOffAt: Date,
  paidUpTo: {
    type: Date,
    default: function() {
      var date = new Date();
      date.setHours(date.getHours()+1)
      return date;
    }
  },
  notes: Object,
  config: {
    type: Object,
    default: {}
  },
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
