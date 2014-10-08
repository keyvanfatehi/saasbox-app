var dns = require('../dns')
  , destroyInstance = require('../destroy_instance')
  , createInstance = require('../create_instance')
  , reconfigureInstance = require('../reconfigure_instance')
  , priceMatrix = require('../../../etc/price_matrix')
  , regions = require('../../../etc/regions')
  , products = require('../../../products')

module.exports = function (req, res, next) {
  if (req.body.status === 'off') {
    destroyInstance(req.user, req.instance, req.agent, next)
  } else if (req.body.status === 'on') {
    var problems = [];

    var product = req.instance.getProduct()
    if (product.inDevelopment)  {
      problems.push(product.title+" hosting is currently in development. You will receive an email from us when it becomes available.")
    }

    if (!!!req.user.email)
      problems.push('Please setup your email address')

    if (!req.user.isBillingOk())
      problems.push('Please setup your billing information')

    if (problems.length > 0)
      res.status(403).json({ problems: problems })
    else {
      var spec = priceMatrix[req.body.size]
      var region = regions[req.body.region]
      if (spec && region) {
        createInstance(req.user, req.instance, req.agent, spec, req.body.region, req.body.config, next)
      } else {
        res.status(500).end('Invalid size or region')
      }
    }
  } else if (req.body.status === 'reconfigure') {
    reconfigureInstance(req.instance, req.body.config, next)
  } else {
    res.status(501).end()
  }
}
