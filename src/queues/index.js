var Queue = require('../queue')

module.exports = {
  instanceProvisioner: Queue('instance provisioner'),
  instanceConfigurator: Queue('instance configurator')
}
