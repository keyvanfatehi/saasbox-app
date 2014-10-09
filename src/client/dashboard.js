var Account = require('./controllers/account_controller')
  , Instance = require('./controllers/instance_controller')
  , appSelectModal = require('./app_select_modal')(React)

module.exports = {
  mountAccount: function(sel) {
    new Account().mountInterface(sel);
  },

  mountInstances: function() {
    $('#create_instance').click(appSelectModal(function(instance) {
      var div = $('<div>')
      new Instance(instance._id, instance.slug).mountInterface(div)
      $('#instances').append(div)
    }))
    $('#instances > div').each(function(i, el) {
      var id = $(el).data('id')
      var slug = $(el).data('slug')
      new Instance(id, slug).mountInterface(el)
    })
  }
}
