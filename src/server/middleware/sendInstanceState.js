var _ = require('lodash')

module.exports = function (req, res, next) {
  if (req.agent.provisioning) {
    res.json({
      status: 'not yet ready',
      progress: req.instance.progress
    })
  } else {
    if (req.instance.ready) {
      req.agent.perform('inspect', req.params.slug, {
        namespace: req.user.username
      }, function(err, ares) {
        res.status(200)
        var running = null;
        var error = null;
        try {
          running = ares.body.State.Running
        } catch (e) {
          running = false;
        } finally {
          res.json(_.assign({
            status: running ? 'on' : 'off',
            error: err ? err.message : null
          }, req.instance || {}))
        }
      })
    } else {
      res.json({ status: 'off' })
    }
  }
}
