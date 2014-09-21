var config = require('../../../etc/config')
var Instance = require('../models/instance')
  , _ = require('lodash')

module.exports = function (req, res, next) {
  req.user.populate('instances', function(err, instances) {
    if (err) return next(err);
    if (instances.length > 0) {
      req.instance = _.find(instances, { slug: req.params.slug });
    }
    if (req.instance) {
      return next();
    } else {
      req.instance = new Instance({
        slug: req.params.slug,
        account: req.user._id,
        agentConfig: {}
      })
      return next();
    }
  });
}
