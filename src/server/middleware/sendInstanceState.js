var _ = require('lodash')

var instanceProvisioningState = require('../../instance_provisioning_state')

module.exports = function (req, res, next) {
  var payload = {
    _id: req.instance._id,
    status: 'off'
  }
  if (req.instance.agent.provisioning) {
    var state = instanceProvisioningState(req.instance.agent.provisioning.state)
    return res.json(_.assign(payload, state))
  } else if (req.instance.agent.provisioned) {
    req.agent.perform('inspect', req.params.slug, {
      namespace: req.instance.name
    }, function(err, res2) {
      if (err) {
        payload.error = {
          message: err.message,
          stack: err.stack
        }
      } else {
        payload.status = res2.body.State.Running ? 'on' : 'off'
      }
      return res.json(payload)
    })
  } else {
    payload.status = 'off'
    res.json(payload)
  }
}
