var Account = require('./controllers/account_controller')
  , Instance = require('./controllers/instance_controller')
  , appSelectModal = require('./choose_app_modal')(React)
  , queryString = require('query-string')

module.exports = {
  myAccount: function(opts) {
    new Account().mountInterface(opts.selector);
  },

  myApps: function() {
    var appCreationFlow = appSelectModal(function(instance) {
      var div = $('<div>')
      new Instance(instance._id, instance.slug).mountInterface(div)
      $('#instances').append(div)
    })

    var qs = queryString.parse(location.search);
    if (qs.action === 'new') appCreationFlow(qs)

    $('#create_instance').click(appCreationFlow)

    $('#instances > div').each(function(i, el) {
      var id = $(el).data('id')
      var slug = $(el).data('slug')
      new Instance(id, slug).mountInterface(el)
    })
  },
}
