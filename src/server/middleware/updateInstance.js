var dns = require('../dns')
  , async = require('async')
  , destroyInstance = require('../destroy_instance')
  , createInstance = require('../create_instance')

module.exports = function (req, res, next) {
  if (req.body.status === 'off') {
    destroyInstance(req.user, req.agent, req.params.slug, next)
  } else if (req.body.status === 'on') {
    if (req.user.emailAddress && req.user.stripeToken) {
      createInstance(req.user, req.agent, req.params.slug, next)
    } else {
      res.status(402).send('Payment Required');
    }
  } else res.status(422).end()
}
