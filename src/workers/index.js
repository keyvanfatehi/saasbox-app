var logger = require('../logger')
  , Queues = require('../queues')
  , instanceProvisioner = require('./instance_provisioner')

module.exports = {
  process: function() {
    instanceProvisioner(Queues.instanceProvisioner)
    logger.info("worker "+process.pid+" processing instance provisioning jobs")
  }
}
