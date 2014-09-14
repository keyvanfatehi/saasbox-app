/** @jsx React.DOM */
module.exports = function(React) {
  var centsAsDollars = require('../cents_as_dollars');

  var AccountControl = React.createClass({
    getInitialState: function() {
      return { balance: 0 }
    },
    loadState: function(data) {
      analytics.identify(data._id, {
        username: account.username,
        balance: account.balance
      })
      this.setState({ balance: data.balance });
    },
    render: function() {
      return (
        <div>
          <p>Account Balance: ${centsAsDollars(this.state.balance)}</p>
          <a href="#" onClick={this.deleteAccount}>Delete Account</a>
          <a href="#" onClick={this.destroy}>Add Payment Method</a>
          <a href="#" onClick={this.destroy}>Add / Confirm Email Address</a>
        </div>
      );
    },
    componentWillMount: function() {
      this.resourcePath = '/api/v1/account';
      $.getJSON(this.resourcePath, this.loadState);
    },
    deleteAccount: function() {
      $.ajax({
        type: 'DELETE', 
        url: this.resourcePath,
        data: JSON.stringify({ confirm: (
          confirm('Do you really want to DELETE your account? All apps and data will be destroyed.') &&
          confirm('Are you absolutely sure that you want to irreversibly DELETE your account, apps, and data?')
        )
        }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(data) {
          if (data.deleted)
            window.location = '/'
        }
      })
    }
  });
  return AccountControl
}
