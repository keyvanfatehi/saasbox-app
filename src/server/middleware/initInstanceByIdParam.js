var models = require('../models')
  , Instance = models.Instance

module.exports = function(req, res, next) {
  Instance.findById(req.params.id).exec(function(err, instance) {
    if (err) return next(err);
    req.instance = instance;
    next();
  })
}
