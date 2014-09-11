var p = '../../../middleware'
  , initializeInstance = require(p+'/initializeInstance')
  , sendInstanceState = require(p+'/sendInstanceState')
  , initializeAgent = require(p+'/initializeAgent')
  , updateInstance = require(p+'/updateInstance')
  , authorizeUser = require(p+'/authorizeUser')

module.exports = function (r) {
  r.route('/instance/:slug')
  .all(authorizeUser, initializeInstance, initializeAgent)
  .get(sendInstanceState)
  .put(updateInstance, sendInstanceState)
}
