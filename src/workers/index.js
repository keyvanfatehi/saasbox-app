var logger = require('../logger')
  , Queues = require('../queues')
  , instanceProvisioner = require('./instance_provisioner')
  , instanceConfigurator = require('./instance_configurator')

module.exports = {
  process: function() {
    instanceProvisioner(Queues.instanceProvisioner)
    logger.info("worker "+process.pid+" processing instance provisioning jobs")
    instanceConfigurator(Queues.instanceConfigurator)
    logger.info("worker "+process.pid+" processing instance configurator jobs")
  }
}
