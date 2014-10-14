var version = require('../../../package').version
  , products = require('../../../products')
  , regions = require('../../../etc/regions')
  , trial = require('../../trial')
  , dollar = require('../../cent_to_dollar')
  , setLocals = require('express-defaultlocals')
  , config = require('../../../etc/config')

module.exports = setLocals(function(req) {
  return {
    app_name: config.app_name,
    title: config.web_title,
    dist: process.env.NODE_ENV === 'production' ? 'min' : 'dev',
    version: version,
    user: req.user,
    products: products,
    regions: regions,
    trial: trial,
    dollar: dollar,
    flash: {
      info: req.flash('info'),
      error: req.flash('error')
    }
  }
})
