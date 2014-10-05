module.exports = {
  isBillingOk: require('./isBillingOk'),
  updateBillingInfo: require('./updateBillingInfo'),
  generatePasswordRecoveryToken: function(cb) {
    var token = Math.random().toString(36).substring(2)
    this.update({
      passwordRecoveryToken: token
    }, function(err) {
      if (err) return cb(err);
      cb(null, token)
    })
  }
}
