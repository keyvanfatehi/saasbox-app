var sendInstanceState = require('../../../middleware/sendInstanceState')
  , initializeAgent = require('../../../middleware/initializeAgent')
  , updateInstance = require('../../../middleware/updateInstance')
  , authorizeUser = require('../../../middleware/authorizeUser')
  , initializeInstance = require('../../../middleware/initializeInstance')

module.exports = function (r) {
  r.route('/instance')
  .all(authorizeUser, initializeInstance, initializeAgent)
  .get(sendInstanceState)
  .put(updateInstance, sendInstanceState)
}
