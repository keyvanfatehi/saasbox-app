module.exports = function() {
  var account = this;
  return account.populateAsync('instances').then(function(account) {
    return account.instances
  }).map(function(instance) {
    return instance.selfDestructAsync()
  }).then(function() {
    return account;
  })
}
