var _ = require('lodash')
var logger = require('../../logger')

var instanceProvisioningState = require('../../instance_provisioning_state')

module.exports = function (req, res, next) {
  var payload = {
    _id: req.instance._id,
    fqdn: req.instance.fqdn,
    status: 'off',
    notes: req.instance.notes,
    config: req.instance.config,
    turnedOnAt: req.instance.turnedOnAt,
    balanceMovedAt: req.instance.balanceMovedAt,
    size: req.instance.size
  }
  if (req.instance.agent.provisioning) {
    var state = instanceProvisioningState(req.instance.agent.provisioning.state)
    return res.json(_.assign(payload, state))
  } else if (req.instance.agent.public_ip) {
    req.agent.perform('inspect', req.params.slug, {
      namespace: req.instance.name
    }, function(err, res2) {
      if (err) {
        payload.error = {
          message: err.message,
          stack: err.stack
        }
      } else {
        try {
          payload.status = res2.body.State.Running ? 'on' : 'off'
        } catch (e) {
          try {
            logger.warn(req.agent.identifier, res2.body.toString())
          } catch(e) {} finally {
            logger.error(e.stack)
          }
          payload.status = 'error'
        }
      }
      return res.json(payload)
    })
  } else {
    payload.status = 'off'
    res.json(payload)
  }
}
