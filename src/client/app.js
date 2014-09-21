var io = require('socket.io/node_modules/socket.io-client')
  , Account = require('./controllers/account_controller')
  , Instance = require('./controllers/instance_controller')

require('../../vendor/bootstrap-3.2.0/js/modal')
require('../../vendor/bootstrap-3.2.0/js/tooltip')

window.createModal = function (cmp) {
  var div = $('<div></div>')
  $(window.document.body).append(div);
  return React.renderComponent(cmp, div.get(0))
}

window.startDashboard = function() {
  var account = new Account();
  account.mountInterface('#account');

  $('.app > [data-slug]').each(function(i, el) {
    var slug = $(el).data('slug');
    var instance = new Instance(slug, account, io);
    instance.mountInterface(el);
  });
}
