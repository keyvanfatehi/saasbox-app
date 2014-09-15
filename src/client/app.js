/** @jsx React.DOM */
var centsAsDollars = require('./cents_as_dollars')
  , Account = require('./controllers/account_controller')
  , Instance = require('./controllers/instance_controller')
  , account = null

window.startDashboard = function() {
  account = new Account();
  account.mountInterface('#account');

  $('.app .react[data-slug]').each(function(i, el) {
    var slug = $(el).data('slug');
    var instance = new Instance(slug);
    instance.mountInterface(el);
  });
}

window.productCheckout = function(options, callback) {
  var product = options.product;
  var $perhour = "$"+centsAsDollars(product.centsPerHour)
  account.fetch(function(data) {
    StripeCheckout.open({
      key: ( process.env.NODE_ENV === "production" ? 
            alert('we have not formed a company yet!') :
            'pk_test_7wYQao2Gn0HikrmIQdBEf8yS' ),
      image: '/img/app_logos/'+options.slug+'.png',
      token: callback,
      name: "FTC, LLC",
      description: "Pay as you go "+product.title+" (min ~"+$perhour+"/hr)",
      email: data.email,
      amount: 0,
      panelLabel: "Subscribe",
      opened: options.opened,
      closed: options.closed,
      allowRememberMe: true
    })
  })
}
