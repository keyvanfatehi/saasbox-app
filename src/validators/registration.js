var usernameMinLen = 3
var passMinLen = 6
var subdomainablePattern = /^[a-z]+[a-z0-9]+$/

var FormErrors = function(type) {
  var errors = (type === 'object' ? {} : [])
  this.add = function(field, message) {
    if (type === 'object') {
      errors[field] = errors[field] || [];
      errors[field].push(message)
    } else {
      errors.push(message)
    }
  }
  this.render = function() {
    return errors
  }
}

module.exports = function(body, returnType) {
  var errors = new FormErrors(returnType);

  var usernameCanBeSubdomain = subdomainablePattern.test(body.username)
  if (!usernameCanBeSubdomain)
    errors.add('username', "Username must start with a letter and may only contain lowercase letters and numbers")

  var emailMustExist = body.email.length > 0 && /@/.test(body.email)
  if (!emailMustExist)
    errors.add('email', "Email address must exist")

  var usernameLongEnough = body.username && body.username.length >= usernameMinLen
  if (!usernameLongEnough)
    errors.add('username', "Username must be at least "+usernameMinLen+" characters")

  var passLongEnough = body.password && body.password.length >= passMinLen
  if (!passLongEnough) {
    errors.add('password', "Password must be at least "+passMinLen+" characters")
    errors.add('password_confirmation', "Password confirmation must be at least "+passMinLen+" characters")
  }

  var passDoesMatch = body.password === body.password_confirmation
  if (!passDoesMatch)
    errors.add('password_confirmation', "Password confirmation did not match")

  return errors.render()
}
