module.exports = function() {
  return this.populateAsync('instances').then(function(account) {
    return account.instances
  }).map(function(instance) {
    return instance.selfDestructAsync()
  })
}
