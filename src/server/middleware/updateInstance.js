getAccountBalance = require('../../account_balance')

module.exports = function (req, res, next) {
  var instance = req.user.instance;
  if (req.body.status === 'off') {
    req.agent.perform('destroy', instance, function(err, ares) {
      var newBalance = getAccountBalance(req.user);
      instance.turnedOffAt = new Date();
      instance.turnedOnAt = null;
      instance.balanceMovedAt = new Date();
      // delete the proxy, remove it from instance
      req.user.update({
        balance: newBalance,
        instance: instance
      }, next);
    })
  } else if (req.body.status === 'on') {
    req.agent.perform('install', instance, function(err, ares) {
      instance.turnedOffAt = null;
      instance.turnedOnAt = new Date();
      // create the proxy, add it to the instance
      req.user.update({ instance: instance }, next)
    })
  } else res.status(422).end()
}
