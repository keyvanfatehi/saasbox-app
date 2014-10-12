var createInstance = require('../create_instance')
  , priceMatrix = require('../../../etc/price_matrix')
  , regions = require('../../../etc/regions')
  , cloudProviders = require('../../cloud_providers')
  , Instance = require('../models').Instance
  , instanceCost = require('../../instance_cost')

module.exports = function (req, res, next) {
  var problems = []
  var instance = new Instance({
    slug: req.body.slug,
    account: req.user._id
  })

  var size = priceMatrix[req.body.size]
  var firstHourCost = instanceCost(size.cents).hourly.cents

  if (!req.user.email)  {
    problems.push('You must confirm your email address')
  }

  if (!req.user.isBillingOk({ cents: firstHourCost }))
    problems.push('Please setup your billing information')

  if (problems.length > 0)
    res.status(403).json({ problems: problems })
  else {
    var cloud = cloudProviders[req.body.cloud]
    var region = regions[req.body.region]
    if (cloud && size && region) {
      createInstance(req.user, instance, req.body.cloud, size, req.body.region, function(err, instance) {
        req.instance = instance;
        req.user.balance += firstHourCost;
        req.user.save(function(err) {
          if (err) return next(err);
          next()
        })
      })
    } else {
      res.status(400).end('Unacceptable payload')
    }
  }
}
