var models = require('../../../src/server/models')
var accountPreconditions = require('./account_preconditions')

var account = null;


var loadPreconditions = function(descs) {
  var presets = accountPreconditions(account)
  var funcs = [];
  descs.forEach(function(desc) {
    funcs.push(presets[desc])
  })
  return funcs
}

var createAccount = function(done) {
  account = new models.Account();
  account.save(function(err, acc) {
    if (err) throw err;
    done(err, acc);
  });
}

module.exports = {
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
  },
  loadPreconditions: loadPreconditions
}
