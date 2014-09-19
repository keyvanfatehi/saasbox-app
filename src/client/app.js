var Account = require('./controllers/account_controller')
  , Instance = require('./controllers/instance_controller')

require('../../vendor/bootstrap-3.2.0/js/modal')

window.createModal = function (cmp) {
  return React.renderComponent(cmp, $('#modal-mountnode').get(0))
}

window.startDashboard = function() {
  var account = new Account();
  account.mountInterface('#account');

  $('.app > [data-slug]').each(function(i, el) {
    var slug = $(el).data('slug');
    var instance = new Instance(slug, account);
    instance.mountInterface(el);
  });
}
