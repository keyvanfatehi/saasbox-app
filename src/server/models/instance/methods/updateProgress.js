module.exports = function(progress, cb) {
  this.agent.provisioning.progress = progress;
  var id = this._id;
  return this.update({ agent: this.agent }, cb)
}
