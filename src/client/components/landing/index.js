/** @jsx React.DOM */
module.exports = function (React) {
  var AccountControl = require('./account_control')(React)
  var InstanceControl = require('./instance_control')(React)
  var Landing = React.createClass({
    getInitialState: function() {
      return { accountBalance: 0 }
    },
    render: function() {
      return (
        <div>
          <h2>Instance</h2>
          <InstanceControl />
          <h2>Account</h2>
          <AccountControl balance={this.state.accountBalance} />
        </div>
      );
    },
    componentDidMount: function() {
      $.getJSON('/api/v1/account', function(account) {
        this.setState({ accountBalance: account.balance })
        analytics.identify(account._id, {
          username: account.username,
          balance: account.balance
        })
      }.bind(this));
    }
  });
  return Landing
}
