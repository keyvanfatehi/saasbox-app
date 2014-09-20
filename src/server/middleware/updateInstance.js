var dns = require('../dns')
  , async = require('async')
  , destroyInstance = require('../destroy_instance')
  , createInstance = require('../create_instance')

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
    else
      // so what is the falvor dude
      createInstance(req.user, req.agent, req.params.slug, next)

  } else res.status(406).end()
}
