var io = require('socket.io/node_modules/socket.io-client')
  , Account = require('./controllers/account_controller')
  , Instance = require('./controllers/instance_controller')

module.exports = function() {
  var account = new Account();
  account.mountInterface('#account');

  $('.app > [data-slug]').each(function(i, el) {
    var slug = $(el).data('slug');
    var instance = new Instance(slug, account, io);
    instance.mountInterface(el);
  });
}