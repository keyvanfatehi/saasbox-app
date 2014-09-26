var Promise = require('bluebird')

module.exports = {
  findByIdAndPopulateAccount: function(id) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.findOne({ _id: id })
      .populate('account')
      .exec(function(err, instance) {
        if (err) return reject(err);
        return resolve(instance)
      }, function(err) {
        return reject(err);
      })
    })
  }
}
