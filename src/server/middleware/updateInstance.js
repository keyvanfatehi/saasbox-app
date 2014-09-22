var dns = require('../dns')
  , async = require('async')
  , destroyInstance = require('../destroy_instance')
  , createInstance = require('../create_instance')
  , priceMatrix = require('../../../etc/price_matrix')
  , regions = require('../../../etc/regions')

module.exports = function (req, res, next) {
  if (req.body.status === 'off') {
    destroyInstance(req.user, req.agent, req.params.slug, next)
  } else if (req.body.status === 'on') {
    var problems = [];

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
        createInstance(req.user, req.instance, req.agent, spec, req.body.region, next)
      } else {
        res.status(500).end('Invalid size or region')
      }
    }

  } else res.status(501).end()
}
