var _ = require('lodash')

module.exports = function (req, res, next) {
  if (req.instance.agent.provisioning) {
    res.json({
      status: 'provisioning',
      progress: req.instance.agent.provisioning.progress
    })
  } else {
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
        res.json({
          status: running ? 'on' : 'off',
          error: err ? err.message : null
        });
      }
    })
  }
}
