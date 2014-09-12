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

  $('li[data-slug]').each(function(i, e) {
    var slug = $(e).data('slug');
    var product = products[slug];
    React.renderComponent(<div>
      <h2>{product.title}</h2>
      <ul>
        <li><a target='blank' href={product.websiteURL}>Official Website</a></li>
        <li><a target='blank' href={product.sourceCodeURL}>Code Repository</a></li>
        <li><a target='blank' href={product.dockerImageURL}>Docker Image</a></li>
        <li><InstanceControl slug={slug} product={product} /></li>
      </ul>
    </div>, e);
  });
}

window.productCheckout = function(options) {
  var product = options.product;
  StripeCheckout.open({
    key: 'pk_test_7wYQao2Gn0HikrmIQdBEf8yS',
    // image: '/square-image.png',
    token: options.stripe,
    name: "Hosted "+product.title,
    description: "$"+centsAsDollars(product.centsPerHour)+" / hour for unlimited usage",
    amount: 0,
    panelLabel: "Submit",
    opened: options.opened,
    closed: options.closed
  })
}
