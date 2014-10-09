var queues = require('../../../../queues')
  , Queue = queues.instanceProvisioner

module.exports = function () {
  Queue.add({ instance: this._id.toString() })
}
