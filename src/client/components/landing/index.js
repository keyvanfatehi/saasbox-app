/** @jsx React.DOM */
module.exports = function (React) {
  var AccountControl = require('./account_control')(React)
  var InstanceControl = require('./instance_control')(React)

  var slug = 'strider';
  var product = require('../../../../products')[slug];

  return {
    startDashboard: function() {
      console.log('hi');
    }
  }

  /*
  var Landing = React.createClass({
    getInitialState: function() {
      return { accountBalance: 0 }
    },
    render: function() {
      return (
        <div>
          <h1>Account</h1>
          <AccountControl balance={this.state.accountBalance} />
          <div>
            <h1>Products</h1>
            <h2>{product.title}</h2>
            <InstanceControl slug={slug} product={product} />
          </div>
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
  */
}
