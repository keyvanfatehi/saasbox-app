/** @jsx React.DOM */
var AccountControl = require('./components/landing/account_control')(React)
var InstanceControl = require('./components/landing/instance_control')(React)
var products = require('../../products')
var centsAsDollars = require('./components/landing/cents_as_dollars')

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

  $('.app .react[data-slug]').each(function(i, e) {
    var slug = $(e).data('slug');
    var product = products[slug];
    React.renderComponent(<div>
      <ul>
        <li><InstanceControl slug={slug} product={product} /></li>
      </ul>
    </div>, e);
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
