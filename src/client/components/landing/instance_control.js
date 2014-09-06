/** @jsx React.DOM */
module.exports = function(React) {
  var getInstanceBalance = require('../../../instance_balance');
  var centsAsDollars = require('./cents_as_dollars');
  var path = '/api/v1/instance';
  var product = require('../../../../product')

  var put = function(data, success) {
    $.ajax({
      type: 'PUT', 
      url: path,
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
      success: success
    })
  }
  var InstanceControl = React.createClass({
    getInitialState: function() {
      return {status: 'getting status'};
    },
    loadState: function(data) {
      this.setState({
        status: data.status,
        balance: centsAsDollars(getInstanceBalance(data, product.centsPerHour)),
        fqdn: data.fqdn,
        admin: data.admin
      })
    },
    turnOn: function() {
      this.setState({ status: 'turning on' })
      put({ status: 'on' }, this.loadState)
    },
    turnOff: function() {
      var ok = confirm('Turning it off is currently destructive -- all data will be lost. Continue?')
      if (ok) {
        this.setState({ status: 'turning off' })
        put({ status: 'off' }, this.loadState)
      }
    },
    openInterface: function() {
      window.open('https://'+this.state.fqdn);
    },
    render: function() {
      var buttonStates = {
        on: <span>
          <p>admin: {JSON.stringify(this.state.admin)}</p>
          <p>note that your instance subdomain may take some time to propagate</p>
          <button onClick={this.turnOff}>Turn off</button>
          <button onClick={this.openInterface}>Open Interface</button>
        </span>,
        off: <button onClick={this.turnOn}>Turn on</button>
      }
      return (
        <div>
          <p>Status: {this.state.status}</p>
          <p>Balance: ${this.state.balance}</p>
          {buttonStates[this.state.status]}
        </div>
      );
    },
    componentDidMount: function () {
      $.getJSON(path, this.loadState);
    }
  });
  return InstanceControl
}
