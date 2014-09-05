module.exports = function (req, res, next) {
  if (req.body.status === 'off') {
    req.agent.perform('destroy', req.user.instance, function(err, ares) {
      // delete the proxy
      next()
    })
  } else if (req.body.status === 'on') {
    req.agent.perform('install', req.user.instance, function(err, ares) {
      // create the proxy
      next()
    })
  } else res.status(422).end()
}
