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
  setupDNS: require('./setupDNS')
}
