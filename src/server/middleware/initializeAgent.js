var Agent = require('../agent')
  , config = require('../../../etc/config')
  , _ = require('lodash')

module.exports = function (req, res, next) {
  var agentConfig = _.find(config.agents, {
    name: req.user.instance.agent
  });
  if (agentConfig) {
    req.agent = new Agent(agentConfig)
    next()
  } else {
    res.status(500).end('Unknown agent: '+req.user.instance.agent)
  }
}
