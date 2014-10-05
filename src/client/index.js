var io = require('socket.io/node_modules/socket.io-client')
  , Account = require('./controllers/account_controller')
  , Instance = require('./controllers/instance_controller')
  , analytics = require('./analytics')

require('../../vendor/bootstrap-3.2.0/js/modal')
require('../../vendor/bootstrap-3.2.0/js/tooltip')

window.createModal = require('./create_modal')(React, window)
window.errorModal = require('./error_modal')(React, createModal)
window.startRegistrationForm = require('./registration_form')
window.startDashboard = require('./dashboard')

module.exports = window
analytics(window)
