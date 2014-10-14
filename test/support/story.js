module.exports = function(loader) {
  return function(steps, cb) {
    describe(steps.join(', '), function() {
      if (loader)
        beforeEach(loader(steps))
      cb();
    })
  }
}
