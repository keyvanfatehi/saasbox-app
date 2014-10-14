var models = require('../../../src/server/models')

var account = null;


var createAccount = function(done) {
  account = new models.Account();
  account.save(function(err, acc) {
    if (err) throw err;
    done(err, acc);
  });
}

module.exports = {
  accountSteps: require('./account_steps'),
  createAccount: createAccount,
  getAccount: function() {
    return account
  },
  afterTick: function(key) {
    var freq = require('../../../src/enforcer/'+key)
    return function(assertions) {
      return function(done) {
        freq.onTick(function(err) {
          if (err) return done(err);
          models.Account.findOne({
            _id: account._id.toString()
          }).populate('instances')
          .exec(function(err, acc) {
            assertions(acc);
            done(err);
          })
        })
      }
    }
  }
}
