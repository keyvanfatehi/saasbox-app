var usernameMinLen = 3
var passMinLen = 6
var subdomainablePattern = /^[a-z]+[a-z0-9]+$/

module.exports = function(body) {
  var errors = []

  //var hasStripeKey = body.stripe_key;
  //if (!hasStripeKey)
  //  errors.push("Payment information must be attached")

  var usernameCanBeSubdomain = subdomainablePattern.test(body.username)
  if (!usernameCanBeSubdomain)
    errors.push("Username must start with a letter and may only contain lowercase letters and numbers")

  var usernameLongEnough = body.username.length >= usernameMinLen
  if (!usernameLongEnough)
    errors.push("Username must be at least "+usernameMinLen+" characters")

  var passLongEnough = body.password.length >= passMinLen
  if (!passLongEnough)
    errors.push("Password must be at least "+passMinLen+" characters")

  var passDoesMatch = body.password === body.password_confirmation
  if (!passDoesMatch)
    errors.push("Password confirmation did not match")

  return errors
}
