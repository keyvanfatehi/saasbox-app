/** @jsx React.DOM */
module.exports = function(React, StripeButton) {
  var getInstanceBalance = require('../../../instance_balance');
  var centsAsDollars = require('./cents_as_dollars');

  var InstanceControl = React.createClass({
    getInitialState: function() {
      return {loading: true, status: 'getting status'};
    },
    loadState: function(data) {
      this.setState({
        loading: false,
        status: data.status,
        balance: centsAsDollars(getInstanceBalance(data, this.props.product.centsPerHour)),
        fqdn: data.fqdn,
        notes: data.notes,
        turnedOnAt: data.turnedOnAt
      })
    },
    turnOn: function() {
      this.setState({ status: 'turning on' })
      this.putState({ status: 'on' }, this.loadState)
    },
    turnOff: function() {
      var ok = confirm('Turning it off is currently destructive -- all data will be lost. Continue?')
      if (ok) {
        this.setState({ status: 'turning off' })
        this.putState({ status: 'off' }, this.loadState)
      }
    },
    openInterface: function() {
      window.open('https://'+this.state.fqdn);
    },
    render: function() {
      var propagationNote = function(fqdn, date) {
        var minutesOn = (new Date() - new Date(date)) / 1000 / 60;
        if (minutesOn > 10) return '';
        return <b>Please be patient while {fqdn} propagates.</b>
      }

      var notes = function(state) {
        if (!state.notes) return '';
        state.notes.url = 'https://'+state.fqdn;
        return <div>
          <pre>{JSON.stringify(state.notes, null, 4)}</pre>
          {propagationNote(state.fqdn, state.turnedOnAt)}
        </div>
      }

      var balance = <div>Balance: ${this.state.balance}</div>
      var status = <div>Status: {this.state.loading ? "Loading..." : this.state.status }</div>

      var buttonStates = {
        on: <div>
          {balance}
          {notes(this.state)}
          <button onClick={this.turnOff}>Turn off</button>
          <button onClick={this.openInterface}>Open Interface</button>
        </div>,
        off: <div>
          <button onClick={this.turnOn}>Turn on</button>
        </div>
      }
      return <div>
        <div>{status}</div>
        {buttonStates[this.state.status]}
      </div>
    },
    componentDidMount: function () {
      this.resourcePath = '/api/v1/instance/'+this.props.slug;
      $.getJSON(this.resourcePath, this.loadState);
    },
    putState: function(data, success) {
      $.ajax({
        type: 'PUT', 
        url: this.resourcePath,
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        success: success,
        error: function(err) {
          this.setState({ status: err.status+' '+err.statusText })
          if (err.status === 402) {
            this.beginStripeFlow()
          }
        }.bind(this)
      })
    },
    beginStripeFlow: function() {
      this.setState({ status: 'opening stripe checkout ...' })
      window.productCheckout({
        product: this.props.product,
        opened: function() {
          this.setState({ status: 'waiting ...' });
        }.bind(this),
        closed: function() {
          this.setState({ status: 'off' });
        }.bind(this)
      }, function(token) {
        console.log(token);
        // Use the token to create the charge with a server-side script.
        // You can access the token ID with `token.id`
        this.setState({ status: 'please confirm your email address' });
      });
    }
  });
  return InstanceControl
}
