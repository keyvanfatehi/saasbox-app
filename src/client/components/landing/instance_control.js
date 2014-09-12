/** @jsx React.DOM */
module.exports = function(React) {
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
        return <b>{fqdn} may take a few minutes to propagate.</b>
      }

      var notes = function(state) {
        if (!state.notes) return '';
        state.notes.url = 'https://'+state.fqdn;
        return (
          <p>
            <pre>{JSON.stringify(state.notes, null, 4)}</pre>
            {propagationNote(state.fqdn, state.turnedOnAt)}
          </p>
        )
      }

      var buttonStates = {
        on: <span>
          <p>Balance: ${this.state.balance}</p>
          {notes(this.state)}
          <button onClick={this.turnOff}>Turn off</button>
          <button onClick={this.openInterface}>Open Interface</button>
        </span>,
        off: <button onClick={this.turnOn}>Turn on</button>
      }
      return (
        <div>
          {this.state.loading ? "Loading..." : ''}
          {buttonStates[this.state.status]}
        </div>
      );
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
        success: success
      })
    }
  });
  return InstanceControl
}
