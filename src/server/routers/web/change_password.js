var validatePassword = function(req, res, next) {
  var errors = registrationValidator(req.body, 'object')
  if (errors.password || errors.password_confirmation) {
    res.redirect('back')
  } else {
    next()
  }
}

var getUser = function(req, res, next) {
  if (req.user) return next();
  else if (req.body.passwordRecoveryToken) {
    Account.findOne({
      passwordRecoveryToken: req.body.passwordRecoveryToken
    }, function(err, account) {
      if (err) return res.status(404).end();
      req.user = account;
      next();
    })
  } else {
    res.status(401).end();
  }
}

module.exports = function(router) {
  router.post('/change_password', validatePassword, getUser, function(req, res) {
    req.user.setPassword(req.body.password, function(err, account) {
      if (err) return next(err);
      account.passwordRecoveryToken = null;
      account.save(function(err) {
        if (err) return next(err);
        res.redirect('/');
      })
    })
  })

  router.get('/change_password', function(req, res) {
    if (req.user)
      res.render('change_password');
    else 
      res.redirect('back')
  })
}
