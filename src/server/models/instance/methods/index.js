var products = require('../../../../../products')
  , Agent = require('../../../agent')
  , io = require('../../../socketio')

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
  getProvisioner: function() {
    return require('../../../../../products/'+this.slug+'/provisioner')
  },
  queueProvisioning: require('./queue_provisioning'),
  getAgent: function() {
    return new Agent(this.agent)
  },
  perform: function(action, cb) {
    var args = { namespace: this.name }
    this.getAgent().perform(action, this.slug, args, cb)
  },
  inspectContainer: function(callback) {
    this.perform('inspect', callback)
  },
  socketEmit: function(data) {
    this.populate('account', function(err, i) {
      var room = i.slug+'-'+i.account.username
      io.to(room).emit(i._id, data);
    })
  },
  selfDestruct: require('./selfDestruct')
}
