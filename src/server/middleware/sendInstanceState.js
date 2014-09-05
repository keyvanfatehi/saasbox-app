module.exports = function (req, res, next) {
  req.agent.perform('inspect', req.user.instance, function(err, ares) {
    res.status(200)
    var running = null;
    try {
      running = ares.body.State.Running
    } catch (e) {
      running = false;
    } finally {
      res.json({ status: running ? 'on' : 'off' })
    }
  })
}
