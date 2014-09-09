var router = require('express').Router()
  , product = require('../../../../product')
  , passport = require('passport')
  , Account = require('../../models/account')
  , registrationValidator = require('../../../validators/registration')
  , dns = require('../../dns')
  , config = require('../../../../etc/config')
  , Agent = require('../../agent')
  , logger = require('winston')

function allocateAgent(cb) {
  cb(null, new Agent(config.agents[0]))
}

router.get('/', function(req, res, next) {
  res.render('index.haml', {
    title: "Hosted "+product.title,
    user: req.user
  })
})

router.get('/register', function(req, res) {
  res.render('register', {errors:[]});
});

router.post('/register', function(req, res) {
  var errors = registrationValidator(req.body)
  if (errors.length > 0) {
    res.render('register', { errors: errors })
  } else {
    var account = new Account({ username : req.body.username })
    Account.register(account, req.body.password, function(err, account) {
      if (err) {
        res.render("register", { errors: ["Username is already in use."] } );
      } else {
        passport.authenticate('local')(req, res, function () {
          allocateAgent(function(err, agent) {
            if (err) return next(err);
            var sub = dns.subdomain(req.body.username)
            dns.addRecord(sub, agent.ip, function(err) {
              if (err) logger.error(err.message);
              res.redirect('/');
            })
          })
        });
      }
    });
  }
});

router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router
