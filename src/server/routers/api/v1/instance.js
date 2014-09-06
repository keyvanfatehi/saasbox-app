var sendInstanceState = require('../../../middleware/sendInstanceState')
  , initializeAgent = require('../../../middleware/initializeAgent')
  , updateInstance = require('../../../middleware/updateInstance')

var authorizeUser = function (req, res, next) {
  if (req.user) {
    next()
  } else {
    res.status(401).end();
  }
}

/*
    slug: 'strider',
    agent: 'terranova',
    namespace: 'myuser' 
   */

var product = require('../../../../../product')
var config = require('../../../../../etc/config')

var initializeInstance = function (req, res, next) {
  req.user.instance = req.user.instance || {
    slug: product.slug,
    agent: config.agents[0].name,  // TODO find the best agent
    namespace: req.user.username
  }
  next()
}

module.exports = function (r) {
  r.route('/instance')
  .all(authorizeUser, initializeInstance, initializeAgent)
  .get(sendInstanceState)
  .put(updateInstance, sendInstanceState)
}
