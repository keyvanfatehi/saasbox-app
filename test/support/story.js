/* cucumber style story runner for mocha */
module.exports = function(config) {
  return function(beforeSteps, its, afterSteps) {
    describe(beforeSteps.join(', '), function() {
      beforeSteps.forEach(function(func, i) {
        beforeEach(function(done) {
          loader(config, beforeSteps)[i](done)
        })
      })
      its();
      if (afterSteps && afterSteps.length) {
        afterSteps.forEach(function(func, i) {
          afterEach(function(done) {
            loader(config, afterSteps)[i](done)
          })
        })
      }
    })
  }
}

var loader = function(config, steps) {
  var presets = config.getSteps(config.getContext())
  var funcs = [];
  steps.forEach(function(desc) {
    funcs.push(presets[desc])
  })
  return funcs
}
