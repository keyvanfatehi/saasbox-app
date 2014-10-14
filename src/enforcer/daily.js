/* daily task
  - go through each account
    - balance is negative and billing has been not ok in 7 days or longer
      - flag standing = 'bad'
    - go through each instance
      - move instance balance into account balance
      - if billing not ok
        - if good account standing
          - send email that this instance will be deleted if billing is not fixed within X days
        - if bad standing
          - delete instance
          - email that the instance has been destroyed
      - if using too much resources, suggest upgrade unless already suggested
*/

module.exports = function(context) {
  return {
    cronTime: '00 30 02 * * *',
    humanTime: 'everyday at 02:30:00 AM',
    onTick: function() {
      context.Account.findAsync({})
      .then(function(accounts) {
        accounts.forEach(function(account) {
          account.standing = 'bad'
          account.save(function(err) {
            if (err) return context.errback(err);
          });
        })
      })
      .then(context.callback)
      .error(context.errback)
      .catch(context.errback)
    }
  }
}
