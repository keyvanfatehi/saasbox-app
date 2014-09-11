var Agent = require('../agent')
  , config = require('../../../etc/config')

module.exports = function (req, res, next) {
  var instance = req.user.instances[req.params.slug];
  var agentConfig = config.agents[instance.agent];
  if (agentConfig) {
    req.agent = new Agent(instance.agent, agentConfig)
    next()
  } else {
    res.status(500).end('Unknown agent: '+req.user.instance.agent)
  }
}
