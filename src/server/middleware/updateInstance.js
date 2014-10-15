var dns = require('../dns')
  , reconfigureInstance = require('../reconfigure_instance')
  , priceMatrix = require('../../../etc/price_matrix')
  , regions = require('../../../etc/regions')

module.exports = function (req, res, next) {
  if (req.body.status === 'destroy') {
    req.instance.selfDestruct(next);
  } else if (req.body.status === 'on') {
    reconfigureInstance(req.instance, req.instance.config, next)
  } else if (req.body.status === 'reconfigure') {
    reconfigureInstance(req.instance, req.body.config, next)
  } else {
    res.status(501).end()
  }
}
