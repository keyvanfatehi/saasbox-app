var config = require('../../../etc/config')
var Instance = require('../models/instance')
  , _ = require('lodash')

module.exports = function (req, res, next) {
  Instance.findOne({
    account: req.user._id,
    _id: req.params.id
  }).exec(function(err, instance) {
    if (err) return next(err);
    if (instance) req.instance = instance;
    else return res.status(404).end();
    return next()
  });
}
