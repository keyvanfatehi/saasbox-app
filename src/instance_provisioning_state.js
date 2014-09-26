module.exports = function(state) {
  if (state.failed) {
    return {
      status: 'off',
      progress: null,
      error: state.error
    }
  } else {
    return {
      status: state.status,
      progress: state.progress
    }
  }
}
