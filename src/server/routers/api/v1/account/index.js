var authorizeUser = require('../../../../middleware/authorizeUser')
var deleteAccount = require('../../../../middleware/deleteAccount')

module.exports = function (r) {
  r.route('/account')
  .all(authorizeUser)
  .delete(deleteAccount)
  .get(function(req, res, next) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      balance: req.user.balance,
      billingOk: !!req.user.stripeCustomerId
    })
  })
}
