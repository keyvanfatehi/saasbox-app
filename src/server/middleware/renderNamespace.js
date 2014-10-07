var path = require('path')
  , _ = require('lodash')

module.exports = function(opts) {
  return function(req, res, next) {
    var _render = res.render.bind(res)
    res.render = function(tmpl, locals) {
      var defaults = opts.defaultLocals
      _render(path.join(opts.viewPath, tmpl), _.assign(defaults, locals || {}));
    }
    next()
  }
}
