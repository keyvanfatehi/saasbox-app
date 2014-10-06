module.exports = {
  updateProvisioningState: require('./updateProvisioningState'),
  performInstall: require('./performInstall'),
  setInstallNotes: function(json) {
    console.log('setting notes', json.app)
    this.notes = {
      url: 'https://'+this.fqdn,
      admin: {
        login: json.app.login || json.app.email,
        password: json.app.password
      }
    }
  },
  setTurnedOnNow: function() {
    this.turnedOffAt = null;
    this.turnedOnAt = new Date();
  },
  setTurnedOffNow: function() {
    this.turnedOffAt = new Date();
    this.turnedOnAt = null;
  }
}
