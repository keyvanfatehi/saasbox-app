/** @jsx React.DOM */
var InstanceControl = require('../components/instance_control')(React)
  , products = require('../../../products')
  , centsAsDollars = require('../cents_as_dollars');

function Instance(slug, account) {
  var UI = null
    , product = products[slug]
    , defaultCharge = 100

  this.resourcePath = '/api/v1/instance/'+slug;

  this.mountInterface = function(el) {
    var $el = $(el).get(0);
    var jsx = <InstanceControl slug={slug} product={product} controller={this} />
    UI = React.renderComponent(jsx, $el);
  }

  this.fetch = function(cb) {
    $.getJSON(this.resourcePath, cb)
  }

  this.put = function(data, onsuccess, onerror) {
    $.ajax({
      type: 'PUT', 
      url: this.resourcePath,
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
      success: onsuccess,
      error: onerror
    })
  }

  var productCheckout = function(options, callback) {
    var $permonth = "$"+centsAsDollars(options.tier.cents)
    UI.selectTier(function(err, tier) {
      if (err) return callback(null)
      if (tier) {
        account.fetch(function(data) {
          StripeCheckout.open({
            key: ( process.env.NODE_ENV === "production" ? 
                  alert('have not received my EIN number yet!') :
                  'pk_test_7wYQao2Gn0HikrmIQdBEf8yS' ),
            image: '/img/app_logos/'+options.slug+'.png',
            token: callback,
            name: "FTC, LLC",
            description: "Hosted "+product.title+" @ "+$permonth+"/mo",
            email: data.email,
            amount: defaultCharge,
            panelLabel: "Activate",
            opened: options.opened,
            closed: options.closed,
            allowRememberMe: true
          })
        })
      }
    })
  }

  this.beginStripeFlow = function(tier) {
    UI.setState({ status: 'opening stripe checkout ...' })
    productCheckout({
      tier: tier,
      slug: UI.props.slug,
      product: UI.props.product,
      opened: function() {
        UI.setState({ status: 'waiting ...' });
      },
      closed: function() {
        UI.setState({ status: 'off' });
      }
    }, function(token) {
      UI.setState({ status: 'activating ...' })
      console.log('finish stripe flow', token);
      account.chargeAndSaveCard(token, defaultCharge, function(err) {
        if (err) {
          alert("Stripe Checkout Error:\n"+err.message+"\nYour card has not been charged. Please try a different card or try again later.");
        } else {
          alert("Thank you! Your instance is currently activating. You may now activate additional instances and your payment information will be reused. You will accrue a balance only while instances are active. Your total balance across all instances will be collected and billed in 30 days and continue monthly thereafter for each month you hold a non-zero balance. For more information please see the FAQ.")
        }
      })
    })
  }
}

module.exports = Instance;
