module.exports = function(state) {
  if (!state) return {};
  if (state.failed) {
    state.status = 'off'
    delete state.progress
  }
  return state
}
