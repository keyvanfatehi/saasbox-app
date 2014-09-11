/** @jsx React.DOM */

window.startReactApp = function(options) {
  console.log('start')
  var Landing = require('./components/landing')(React);
  React.renderComponent(<Landing />, options.mountNode);
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
