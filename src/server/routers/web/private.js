var router = require('express').Router()
  , mw = require('../../middleware')

router.use(mw.loginRequired.requireUser)

router.get('/account', function(req, res) {
  res.render('my_account')
})

router.post('/delete_account', function(req, res, next) {
  req.user.destroyAllInstances().then(function() {
    req.user.remove(function(err, user) {
      if (err) return next(err);
      req.flash('info', 'Your account was deleted. Thank you for trying us out!')
      req.logout();
      res.redirect('/')
      user.sendGoodbyeEmail()
    })
  }).error(next).catch(next)
})

router.get('/instances', function(req, res) {
  req.user.populate('instances', function(err) {
    res.render('my_instances')
  })
})

require('./admin')(router)

module.exports = router
