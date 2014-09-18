/** @jsx React.DOM */
module.exports = function(React) {
  var BillingInfo = React.createClass({
    render: function() {
      return (
        <a href="#" onClick={this.beginStripeFlow}>
          {this.props.billingOk ? 'Change' : 'Setup'} Credit Card
        </a>
      )
    },
    beginStripeFlow: function() {
      
    }
  })
  return BillingInfo;
}
