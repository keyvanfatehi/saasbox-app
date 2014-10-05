require('./analytics')(window)
require('../../vendor/bootstrap-3.2.0/js/modal')
require('../../vendor/bootstrap-3.2.0/js/tooltip')

window.createModal = require('./create_modal')(React, window)
window.errorModal = require('./error_modal')(React, createModal)
window.startRegistrationForm = require('./registration_form')
window.startDashboard = require('./dashboard')

module.exports = window
