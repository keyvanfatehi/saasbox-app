var logger = require('../logger')
  , Queues = require('../queues')
  , instanceProvisioner = require('./instance_provisioner')
  , instanceConfigurator = require('./instance_configurator')
  , vpsRemover = require('./vps_remover')

module.exports = {
  process: function() {
    instanceProvisioner(Queues.instanceProvisioner)
    logger.info("worker "+process.pid+": instance provisioning")

    instanceConfigurator(Queues.instanceConfigurator)
    logger.info("worker "+process.pid+": instance configurator")

    vpsRemover(Queues.vpsRemover)
    logger.info("worker "+process.pid+": vps remover")
  }
}
