var Agent = require('../agent')
  , config = require('../../../etc/config')

module.exports = function (req, res, next) {
  var agentConfig = config.agents[req.user.instance.agent];
  if (agentConfig) {
    req.agent = new Agent(req.user.instance.agent, agentConfig)
    next()
  } else {
    res.status(500).end('Unknown agent: '+req.user.instance.agent)
  }
}
