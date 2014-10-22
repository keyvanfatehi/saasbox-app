/* cucumber style story runner for mocha */
module.exports = function(config) {
  var storyBodyFunction = function(beforeSteps, its, afterSteps) {
    return function() {
      beforeSteps.forEach(function(func, i) {
        beforeEach(function(done) {
          loader(config, beforeSteps)[i](done)
        })
      })

      if (config.beforeAssertions)
        config.beforeAssertions()

      its();

      if (config.afterAssertions)
        config.afterAssertions()

      if (afterSteps && afterSteps.length) {
        afterSteps.forEach(function(func, i) {
          afterEach(function(done) {
            loader(config, afterSteps)[i](done)
          })
        })
      }

    }
  }
  var _build = function(fn, _before, _its, _after) {
    fn(_before.join(', '), storyBodyFunction(_before, _its, _after))
  }
  var storyBuilder = function(before, its, after) {
    _build(describe, before, its, after)
  }
  storyBuilder.only = function(before, its, after) {
    _build(describe.only, before, its, after)
  }
  storyBuilder.skip = function(before, its, after) {
    _build(describe.skip, before, its, after)
  }
  return storyBuilder;
}

var loader = function(config, steps) {
  var presets = config.getSteps(config.getContext())
  var funcs = [];
  steps.forEach(function(desc) {
    funcs.push(presets[desc])
  })
  return funcs
}
