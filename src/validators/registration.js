var usernameMinLen = 3
var passMinLen = 6
var subdomainablePattern = /^[a-zA-Z]+[a-zA-Z0-9]+$/

module.exports = function(body) {
  var errors = []

  var usernameCanBeSubdomain = subdomainablePattern.test(body.username)
  if (!usernameCanBeSubdomain)
    errors.push("Username can only contain numbers and letters, starting with a letter")

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
