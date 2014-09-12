var authorizeUser = require('../../../middleware/authorizeUser')

module.exports = function (r) {
  r.route('/account')
  .all(authorizeUser)
  .get(function(req, res, next) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      balance: req.user.balance,
      validCard: req.user.stripe && req.user.stripe.valid
    })
  })
}
