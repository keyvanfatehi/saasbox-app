var io = require('socket.io/node_modules/socket.io-client')
  , Account = require('./controllers/account_controller')
  , Instance = require('./controllers/instance_controller')
  , analytics = require('./analytics')
  , createModal = require('./create_modal')(React, window)
  , errorModal = require('./error_modal')(React, createModal)

module.exports = window

require('../../vendor/bootstrap-3.2.0/js/modal')
require('../../vendor/bootstrap-3.2.0/js/tooltip')

analytics(window)

window.startDashboard = function() {
  var account = new Account();
  account.mountInterface('#account');

  $('.app > [data-slug]').each(function(i, el) {
    var slug = $(el).data('slug');
    var instance = new Instance(slug, account, io);
    instance.mountInterface(el);
  });
}

window.createModal = createModal
window.errorModal = errorModal
