var dns = require('../dns')
  , async = require('async')
  , destroyInstance = require('../destroy_instance')
  , createInstance = require('../create_instance')

module.exports = function (req, res, next) {
  if (req.body.status === 'off') {
    destroyInstance(req.user, req.agent, req.params.slug, next)
  } else if (req.body.status === 'on') {
    if (!!!req.user.email) {
      return res.status(403).json({
        reason: 'Please add your email address first so you can be reliably contacted.'
      })
    }
    if (!!!req.user.stripeToken) {
      return res.status(402).end()
    }
    if (req.user.email && req.user.stripeToken) {
      createInstance(req.user, req.agent, req.params.slug, next)
    }
  } else res.status(406).end()
}
