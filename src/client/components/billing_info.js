/** @jsx React.DOM */
var stripePublicKey = require('../../../etc/stripe.pub')

module.exports = function(React) {
  var Modal = require('./modal')(React);
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
      var account = this.props.controller;
      var amount = 123;
      var self = this;
      account.fetch(function(data) {
        StripeCheckout.open({
          key: stripePublicKey,
          name: "FTC, LLC",
          description: "This charge is automatically refunded.",
          email: data.email,
          amount: amount,
          panelLabel: "Verify Card",
          allowRememberMe: true,
          closed: function () {
            self.setState({ stripeOpen: false });
          },
          token: function (token) {
            account.chargeAndSaveCard(token, amount, function(err) {
              var body = null;
              if (err) {
                body = <div>
                  An error occurred. Your card has not been charged.
                  <pre dangerouslySetInnerHTML={{
                    __html: err.message
                  }} className="alert alert-danger" />
                </div>
              } else {
                account.UI.setState({ billingInfoOk: true })
                body = <div>
                  Thank you!
                  Your card has been charged a small fee ($1.23) for verification purposes.
                  We have already refunded the charge.
                </div>
              }
              createModal(<Modal title="Credit Card Setup" body={body} />);
            })
          }
        })
      })
    }
  })
  return BillingInfo;
}
