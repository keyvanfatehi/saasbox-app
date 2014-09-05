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

  .get(sendInstanceState)

  .put(function(req, res, next) {
    if (req.body.status === 'off') {
      req.agent.perform('destroy', req.user.instance, function(err, ares) {
        // delete the proxy
        next()
      })
    } else if (req.body.status === 'on') {
      req.agent.perform('install', req.user.instance, function(err, ares) {
        // create the proxy
        next()
      })
    } else res.status(422).end()
  }, sendInstanceState)
}

var sendInstanceState = function (req, res, next) {
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
