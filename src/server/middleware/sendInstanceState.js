module.exports = function (req, res, next) {
  var instance = req.user.instance
  req.agent.perform('inspect', instance, function(err, ares) {
    res.status(200)
    var running = null;
    try {
      running = ares.body.State.Running
    } catch (e) {
      running = false;
    } finally {
      instance.state = {
        status: running ? 'on' : 'off'
      }
      res.json(instance.state)
    }
  })
}
