var Agent = require('../agent')
  , config = require('../../../etc/config')
  , _ = require('lodash')

var authorizeUser = function (req, res, next) {
  req.user = {}
  next()
}

var initializeInstance = function (req, res, next) {
  req.user.instance = {
    slug: 'strider',
    agent: 'terranova',
    namespace: 'myuser' 
  }
  next()
}


var initializeAgent = function (req, res, next) {
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

module.exports = function (r) {
  r.route('/instance')

  .all(authorizeUser)

  .all(initializeInstance)

  .all(initializeAgent)

  .get(function (req, res, next) {
    req.agent.perform('inspect', req.user.instance, function(err, ares) {
      if (err) {
        console.log(err);
        res.status(500).json({ status: 'errored: '+err.message });
      } else {
        res.status(200).json({
          status: ares.body.State.Running ? 'on' : 'off'
        })
      }
    })
  })

  .put(function(req, res, next) {
    req.agent.perform('install', req.user.instance, function(err, ares) {
      // use ares to do some other shit like proxy stuff
      res.status(204).end()
    })
  })
}
