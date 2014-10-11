var mw = require('../../../middleware')

module.exports = function (r) {
  r.route('/instances')
  .post(mw.authorizeUser, mw.createInstance, function(req, res) {
    res.json({
      _id: req.instance._id,
      slug: req.instance.slug
    })
  })

  r.route('/instances/:id')
  .all(mw.authorizeUser, mw.initializeInstance)
  .get(mw.sendInstanceState)
  .put(mw.updateInstance, mw.sendInstanceState)
}
