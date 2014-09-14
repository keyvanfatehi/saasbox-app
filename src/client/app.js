/** @jsx React.DOM */
var AccountControl = require('./components/account_control')(React)
var InstanceControl = require('./components/instance_control')(React)
var products = require('../../products')
var centsAsDollars = require('./cents_as_dollars')

window.startDashboard = function() {
  React.renderComponent(<AccountControl />, $('#account').get(0))

  $('.app .react[data-slug]').each(function(i, el) {
    var slug = $(el).data('slug');
    var product = products[slug];
    React.renderComponent(
      <InstanceControl slug={slug} product={product} />
      , el
    );
  });
}

window.productCheckout = function(options, callback) {
  var product = options.product;
  StripeCheckout.open({
    key: ( process.env.NODE_ENV === "production" ? 
          'pk_test_7wYQao2Gn0HikrmIQdBEf8yS' :
          alert('we have not formed a company yet!') ),
    // image: '/square-image.png',
    token: callback,
    name: "Hosted "+product.title,
    description: "$"+centsAsDollars(product.centsPerHour)+" / hour for unlimited usage",
    amount: 0,
    panelLabel: "Submit",
    opened: options.opened,
    closed: options.closed
  })
}
