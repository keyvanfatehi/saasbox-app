/** @jsx React.DOM */
var openStripeCheckout = require('../open_stripe_checkout')

module.exports = function(React) {
  var BillingInfo = React.createClass({
    getInitialState: function () {
      return { stripeOpen: false };
    },
    render: function() {
      var style = this.props.email ? {} : { display: 'none' }
      return (
        <div>
          <a href="#" style={style} onClick={this.beginStripeFlow}>
            {this.props.billingInfoOk ? 'Change' : 'Setup'} Credit Card
          </a>
        </div>
      )
    },
    beginStripeFlow: function() {
      if (this.state.stripeOpen) return false;
      this.setState({ stripeOpen: true });
      var component = this;
      this.props.controller.fetch(function(data) {
        openStripeCheckout(React, component, data.email)
      })
    }
  })
  return BillingInfo;
}
