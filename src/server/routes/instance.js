var sendInstanceState = require('../middleware/sendInstanceState')
  , initializeAgent = require('../middleware/initializeAgent')
  , updateInstance = require('../middleware/updateInstance')

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

module.exports = function (r) {
  r.route('/instance')
  .all(authorizeUser, initializeInstance, initializeAgent)
  .get(sendInstanceState)
  .put(updateInstance, sendInstanceState)
}
