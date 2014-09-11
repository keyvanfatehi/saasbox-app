var _ = require('lodash')

module.exports = function (req, res, next) {
  var instance = req.instance;
  req.agent.perform('inspect', req.params.slug, instance, function(err, ares) {
    res.status(200)
    var running = null;
    try {
      running = ares.body.State.Running
    } catch (e) {
      running = false;
    } finally {
      res.json(_.assign({
        status: running ? 'on' : 'off'
      }, req.instance))
    }
  })
}
