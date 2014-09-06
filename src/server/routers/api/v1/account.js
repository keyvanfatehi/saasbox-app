var authorizeUser = require('../../../middleware/authorizeUser')

module.exports = function (r) {
  r.route('/account')
  .all(authorizeUser)
  .get(function(req, res, next) {
    res.json({
      balance: req.user.balance
    })
  })
}
