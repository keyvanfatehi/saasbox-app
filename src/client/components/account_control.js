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
            <BillingInfo billingOk={this.state.billingOk}/>
          </p>
          <a style={{display:'none'}} onClick={this.props.controller.delete}>Delete Account</a>
        </div>
      );
    },
    componentWillMount: function() {
      this.props.controller.fetch(function(data) {
        console.log(data);
        this.setState({
          email: data.email,
          balance: data.balance,
          billingOk: data.billingOk
        });
      }.bind(this))
    }
  });
  return AccountControl
}
