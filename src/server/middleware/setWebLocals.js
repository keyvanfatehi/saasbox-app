var version = require('../../../package').version
  , priceMatrix = require('../../../etc/price_matrix')
  , products = require('../../../products')
  , regions = require('../../../etc/regions')
  , setLocals = require('express-defaultlocals')

module.exports = setLocals(function(req) {
  return {
    dist: process.env.NODE_ENV === 'production' ? 'min' : 'dev',
    version: version,
    priceMatrix: priceMatrix,
    user: req.user,
    products: products,
    regions: regions,
    flash: {
      info: req.flash('info'),
      error: req.flash('error')
    }
  }
})
