var products = require('../../../../../products')

module.exports = {
  updateProvisioningState: require('./updateProvisioningState'),
  performInstall: require('./performInstall'),
  setInstallNotes: require('./setInstallNotes'),
  setTurnedOnNow: function() {
    this.turnedOffAt = null;
    this.turnedOnAt = new Date();
  },
  setTurnedOffNow: function() {
    this.turnedOffAt = new Date();
    this.turnedOnAt = null;
  },
  setupDNS: require('./setupDNS'),
  getProduct: function() {
    return products[this.slug]
  },
  queueProvisioning: require('./queue_provisioning')
}
