var config = require('../../../etc/config')
var Instance = require('../models/instance')
  , _ = require('lodash')

module.exports = function (req, res, next) {
  req.user.populate('instances', function(err, user) {
    if (err) return next(err);
    if (user.instances.length > 0) {
      req.instance = _.find(user.instances, { slug: req.params.slug });
      console.log(req.instance);
    }
    if (req.instance) {
      return next();
    } else {
      req.instance = new Instance({
        slug: req.params.slug,
        account: req.user._id
      })
      return next();
    }
  });
}
