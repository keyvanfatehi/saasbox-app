var config = require('../../../etc/config')
var _ = require('lodash');

module.exports = function (req, res, next) {
  req.user.instances = req.user.instances || [];
  req.user.instances.push({
    slug: product.slug,
    agent: Object.keys(config.agents)[0],  // TODO find the best agent
    namespace: req.user.username
  })
  next()
}

