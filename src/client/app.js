/** @jsx React.DOM */
var AccountControl = require('./components/landing/account_control')(React)
var InstanceControl = require('./components/landing/instance_control')(React)
var products = require('../../products')

window.startDashboard = function() {
  $.getJSON('/api/v1/account', function(account) {
    analytics.identify(account._id, {
      username: account.username,
      balance: account.balance
    })
    React.renderComponent(
      <AccountControl balance={account.balance} />,
      $('#account').get(0)
    )
  });
  $('li[data-slug]').each(function(i, e) {
    var slug = $(e).data('slug');
    var product = products[slug];
    React.renderComponent(<div>
      <h2>{product.title}</h2>
      <InstanceControl slug={slug} product={product} />
    </div>, e);
  });
}

window.startStripeCheckout = function(options) {
  var handler = StripeCheckout.configure({
    key: 'pk_test_7wYQao2Gn0HikrmIQdBEf8yS',
    // image: '/square-image.png',
    token: function(token) {
      console.log(token);
      // Use the token to create the charge with a server-side script.
      // You can access the token ID with `token.id`
    }
  });

  /*
  options.buttonElement.addEventListener('click', function(e) {
    // Open Checkout with further options
    handler.open({
      name: "Hosted "+product.title,
      description: product.centsPerHour+" cents per hour of uptime",
      amount: 0,
      panelLabel: "Save"
    });
    e.preventDefault();
  });
  */
}
