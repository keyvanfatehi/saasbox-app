var models = require('../../../src/server/models')

var account = null;

var createAccount = function(done) {
  account = new models.Account({
    username: 'testuser',
    stripeCustomerId: 'stripeId'
  });
  account.save(function(err, acc) {
    if (err) throw err;
    done(err, acc);
  });
}

var getContext = function() {
  return account
}

module.exports = {
  getContext: getContext,
  steps: require('./steps'),
  createAccount: createAccount,
  tick: function(freq, done) {
    var id = getContext()._id.toString();
    require('../../../src/enforcer/'+freq).onTick(function(err) {
      if (err) return done(err);
      models.Account.findById(id).populate('instances').exec(done)
    })
  }
}
