module.exports = function(agent, locals, callback) {
  // can be later expanded to define multiple drops
  agent.defineDrop(this.slug, locals, callback)
}
