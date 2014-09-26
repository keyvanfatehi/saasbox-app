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
      billingInfoOk: req.user.isBillingOk()
    })
  })

  r.route('/account/billing_info')
  .all(authorizeUser)
  .put(function (req, res, next) {
    req.user.updateBillingInfo(req.body, function (err) {
      if (err) return next(err);
      else return res.status(200).json({ ok: true });
    })
  })
}
