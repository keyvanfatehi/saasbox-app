module.exports = {
  verifyEmailByToken: function(token, cb) {
    this.findOne({
      unverifiedEmailToken: token
    }).exec(function(err, account) {
      if (err) return cb(err);
      if (!account) return cb(new Error('Not found'));
      account.verifiedEmail().save(function() {
        if (err) return cb(err);
        cb(null)
      })
    })
  }
}
