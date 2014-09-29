module.exports = function(state) {
  if (state.failed) {
    state.status = 'off'
    delete state.progress
  }
  return state
}
