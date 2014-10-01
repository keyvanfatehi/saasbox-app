/** @jsx React.DOM */
var stripePublicKey = require('../../etc/stripe.pub')

module.exports = function(React, component, email) {
  var Modal = require('./components/modal')(React);
  var amount = 123;
  var controller = component.props.controller;
  StripeCheckout.open({
    key: stripePublicKey,
    name: "FTC, LLC",
    description: "This charge is automatically refunded.",
    email: email,
    amount: amount,
    panelLabel: "Verify Card",
    allowRememberMe: true,
    closed: function () {
      component.setState({ stripeOpen: false });
    },
    token: function (token) {
      controller.chargeAndSaveCard(token, amount, function(err) {
        var body = null;
        if (err) {
          body = <div>
          An error occurred. Your card has not been charged.
            <pre dangerouslySetInnerHTML={{
            __html: err.message
          }} className="alert alert-danger" />
          </div>
        } else {
          controller.UI.setState({ billingInfoOk: true })
          body = <div>
            Your card has been charged a small amount ($1.23) for verification purposes.
            We have already refunded the charge. 
            Thank you!
          </div>
        }
        createModal(<Modal title="Credit Card Setup" body={body} />).show();
      })
    }
  })
}
