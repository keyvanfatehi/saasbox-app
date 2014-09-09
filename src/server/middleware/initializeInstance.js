var product = require('../../../product')
var config = require('../../../etc/config')

module.exports = function (req, res, next) {
  return res.next(new Error('you need to finish the agent selector!'))
  req.user.instance = req.user.instance || {
    slug: product.slug,
    agent: config.agents[0].name,  // TODO find the best agent
    namespace: req.user.username
  }
  next()
}

