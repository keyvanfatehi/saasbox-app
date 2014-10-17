module.exports = function(func_to_bump) {
  return function(current, max) {
    return function() {
      if (current < max) {
        current += 1;
        func_to_bump(current)
      }
    }
  }
}
