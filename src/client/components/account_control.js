/** @jsx React.DOM */
module.exports = function(React) {
  var centsAsDollars = require('../cents_as_dollars');
  var EmailForm = require('./email_form')(React);
  var BillingInfo = require('./billing_info')(React);

  var AccountControl = React.createClass({
    getInitialState: function() {
      return { balance: 0, email: '' }
    },
    render: function() {
      return (
        <div>
          <p>Account Balance: ${centsAsDollars(this.state.balance)}</p>
          <p>
            <EmailForm email={this.state.email} controller={this.props.controller} />
          </p>
          <p>
            <BillingInfo email={this.state.email} billingInfoOk={this.state.billingInfoOk} controller={this.props.controller} />
          </p>
          <a style={{display:'none'}} onClick={this.props.controller.delete}>Delete Account</a>
        </div>
      );
    },
    componentWillMount: function() {
      this.props.controller.fetch(function(data) {
        this.setState({
          email: data.email,
          balance: data.balance,
          billingInfoOk: data.billingInfoOk
        });
      }.bind(this))
    }
  });
  return AccountControl
}
