/** @jsx React.DOM */
module.exports = function(React) {
  var dollar = require('../../cent_to_dollar');
  var EmailForm = require('./email_form')(React);
  var BillingInfo = require('./billing_info')(React);

  var Dollars = React.createClass({
    render: function() {
      var cents = this.props.cents;
      if (!cents) return <span />;
      var dollars = dollar(Math.abs(cents));
      var hasCredit = cents < 0;
      if (hasCredit) {
        return <span className="green">(-${dollars})</span>
      } else {
        return <span className="red">${dollars}</span>
      }
    }
  })

  var Account = React.createClass({
    getInitialState: function() {
      return { balance: 0, email: '' }
    },
    render: function() {
      return (
        <div>
          <p>Account Balance: <Dollars cents={this.state.balance}/></p>
          <p>
            <EmailForm email={this.state.email} controller={this.props.controller} />
          </p>
          <p>
            <BillingInfo email={this.state.email} billingInfoOk={this.state.billingInfoOk} controller={this.props.controller} />
          </p>
          <a href="#" onClick={this.props.controller.delete}>Delete Account</a>
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
  return Account
}
