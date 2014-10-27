var registrationValidator = require('../validators/registration')

module.exports = function(o) {
  var username = $(o.username)
  var email = $(o.email)
  var password = $(o.password)
  var confirmation = $(o.confirmation)
  var submit = $(o.submit)
  var validate = function() {
    var errors = registrationValidator({
      username: username.val(),
      email: email.val(),
      password: password.val(),
      password_confirmation: confirmation.val()
    }, 'object')

    username.parent().removeClass('has-error')
    email.parent().removeClass('has-error')
    password.parent().removeClass('has-error')
    confirmation.parent().removeClass('has-error')

    if (Object.keys(errors).length > 0) {
      submit.attr('disabled', 'disabled')
      if (errors.username)
        username.parent().addClass('has-error')
      if (errors.email)
        email.parent().addClass('has-error')
      if (errors.password)
        password.parent().addClass('has-error')
      if (errors.password_confirmation)
        confirmation.parent().addClass('has-error')
    } else {
      submit.removeAttr('disabled')
    }
  }

  username.keyup(validate)
  email.keyup(validate)
  password.keyup(validate)
  confirmation.keydown(validate)
  confirmation.keyup(validate)

  validate()
}
