var Promise = require('bluebird')
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
  },
  findAllAndPopulateInstances: function(cb) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.find({})
      .populate('instances')
      .exec(function(err, accounts) {
        if (err) return reject(err);
        return resolve(accounts)
      }, function(err) {
        return reject(err);
      })
    })
  }
}
