var Agent = require('../agent')
  , config = require('../../../etc/config')

module.exports = function (req, res, next) {
  req.agent = new Agent(req.instance.agentConfig)
  next()
}
