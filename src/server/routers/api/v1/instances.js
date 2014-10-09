var mw = require('../../../middleware')
  , initializeInstance  = mw('initializeInstance')
  , sendInstanceState   = mw('sendInstanceState')
  , updateInstance      = mw('updateInstance')
  , authorizeUser       = mw('authorizeUser')
  , createInstance      = mw('createInstance')

module.exports = function (r) {
  r.route('/instances')
  .post(authorizeUser, createInstance, function(req, res) {
    res.json({
      _id: req.instance._id,
      slug: req.instance.slug
    })
  })

  r.route('/instances/:id')
  .all(authorizeUser, initializeInstance)
  .get(sendInstanceState)
  .put(updateInstance, sendInstanceState)
}
