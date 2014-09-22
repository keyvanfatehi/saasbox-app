module.exports = function(provisioningState, cb) {
  this.agent.provisioning.state = provisioningState
  var id = this._id;
  return this.update({ agent: this.agent }, cb)
}
