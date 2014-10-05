var products = require('../../../../../products')
  , config = require('../../../../../etc/config')
  , Mailhide = require('mailhide')
  , mailhider = new Mailhide(config.mailhide)
  , version = require('../../../../../package').version
  , priceMatrix = require('../../../../../etc/price_matrix')
  , forgotPassword = require('./forgot_password')
  , loginRegister = require('./login_register')

module.exports = function(router) {
  router.use(require('express-defaultlocals')(function(req) {
    return {
      version: version,
      priceMatrix: priceMatrix,
      supportEmail: mailhider.url('keyvanfatehi@gmail.com')
    }
  }))

  router.get('/', function(req, res, next) {
    res.render(req.user ? 'dashboard' : 'landing', {
      user: req.user,
      products: products
    });
  })

  router.get('/change_password', function(req, res) {
    if (req.user)
      res.render('change_password', { account: req.user });
    else 
      res.redirect('back')
  })

  loginRegister(router)
  forgotPassword(router)
}
