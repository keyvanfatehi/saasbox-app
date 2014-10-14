var models = require('../../../src/server/models')
var accountPreconditions = require('./account_preconditions')

var account = null;

var loadPreconditions = function(precon) {
  return function(done) {
    var presets = accountPreconditions(account)
    precon.forEach(function(desc) {
      presets[desc]()
    })
    account.save(done)
  }
}

module.exports = {
  createAccount: function(done) {
    account = new models.Account();
    account.save(function(err, acc) {
      if (err) throw err;
      done();
    });
  },
  getAccount: function() {
    return account
  },
  afterTick: function(key) {
    var freq = require('../../../src/enforcer/'+key)
    return function(assertions) {
      return function(done) {
        freq.onTick(function(err) {
          if (err) return done(err);
          models.Account.findOne({ _id: account._id.toString() }).exec(function(err, acc) {
            assertions(acc);
            done(err);
          })
        })
      }
    }
  },
  loadPreconditions: loadPreconditions
}
