var createInstance = require('../create_instance')
  , priceMatrix = require('../../../etc/price_matrix')
  , regions = require('../../../etc/regions')
  , cloudProviders = require('../../cloud_providers')
  , Instance = require('../models').Instance;

module.exports = function (req, res, next) {
  var problems = []
  var instance = new Instance({
    slug: req.body.slug,
    account: req.user._id
  })

  var product = instance.getProduct()

  if (product.inDevelopment)  {
    problems.push(product.title+" hosting is currently in development. You will receive an email from us when it becomes available.")
  }

  if (!req.user.isBillingOk())
    problems.push('Please setup your billing information')


  if (problems.length > 0)
    res.status(403).json({ problems: problems })
  else {
    var cloud = cloudProviders[req.body.cloud]
    var spec = priceMatrix[req.body.size]
    var region = regions[req.body.region]
    if (cloud && spec && region) {
      createInstance(req.user, instance, req.body.cloud, spec, req.body.region, function(err, instance) {
        req.instance = instance;
        next()
      })
    } else {
      res.status(400).end('Unacceptable payload')
    }
  }
}
