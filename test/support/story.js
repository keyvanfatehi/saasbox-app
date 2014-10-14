module.exports = function(loader) {
  return function(steps, cb) {
    describe(steps.join(', '), function() {
      steps.forEach(function(func, i) {
        beforeEach(function(done) {
          loader(steps)[i](done)
        })
      })
      cb();
    })
  }
}
