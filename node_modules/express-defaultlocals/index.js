var assign = require('lodash.assign')

module.exports = function defaultLocals(localsFn) {
  return function(req, res, next) {
    var render = res.render;
    res.render = function(view, options, fn) {
      options = assign({}, localsFn(req), options)
      render.bind(res)(view, options, fn);
    }
    next();
  }
}
