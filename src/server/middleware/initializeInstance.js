var config = require('../../../etc/config')

module.exports = function (req, res, next) {
  req.user.instances = req.user.instances || {};
  var instance = req.user.instances[req.params.slug] || {
    agent: Object.keys(config.agents)[0] // TODO find the best agent
  }
  req.instance = req.user.instances[req.params.slug] = instance;
  next()
}

