/** @jsx React.DOM */
module.exports = function(React, StripeButton) {
  var ProgressBar = require('./progress_bar')(React);
  var getInstanceBalance = require('../../instance_balance');
  var centsAsDollars = require('../cents_as_dollars');

  var InstanceControl = React.createClass({
    getInitialState: function() {
      return {loading: true, status: 'getting status'};
    },
    loadState: function(state) {
      state.loading = false
      state.status = state.status || 'queued'
      state.balance = centsAsDollars(getInstanceBalance(state, this.props.product.centsPerHour))
      this.setState(state)
    },
    turnOn: function() {
      var commit = function(newState) {
        console.log(newState);
        this.setState({ status: 'turning on' })
        this.putState(newState, this.loadState)
      }.bind(this)
      this.setState({ status: 'Waiting for server selection' })
      this.props.controller.chooseServerSizeAndRegion(function(err, size, region) {
        if (err) {
          this.setState({ status: 'off' });
        } else {
          if (this.props.product.configSchema) {
            this.setState({ status: 'Waiting for configuration' })
            this.props.controller.inputInstanceConfig(function(err, config) {
              if (err) {
                this.setState({ status: 'off' });
              } else {
                commit({ status: 'on', size: size, region: region, config: config })
              }
            }.bind(this))
          } else {
            commit({ status: 'on', size: size, region: region })
          }
        }
      }.bind(this))
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
    showStateError: function() {
      this.props.controller.showError(this.state.error);
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
      var status = <div>
        Status: {this.state.loading ? 
          "Loading..." : 
          this.state.status 
        }
        { this.state.delayReason ? 
          ' ('+this.state.delayReason+')' :
          ''
        }</div>


      var viewStates = {
        on: <div>
          {balance}
          {notes(this.state)}
          <button onClick={this.turnOff}>Disable</button>
          <input type="text" value={this.state.fqdn} readOnly /><button onClick={this.openInterface}>Open</button>
        </div>,
        off: <div>
          <button onClick={this.turnOn}>Activate</button>
          {this.state.error ? 
            <button onClick={this.showStateError}>Show Error</button>
          : '' }
        </div>,
        provisioning: <ProgressBar progress={this.state.progress}/>
      }


      return <div>
        <div>{status}</div>
        {viewStates[this.state.status]}
      </div>
    },
    componentWillMount: function () {
      this.props.controller.fetch(this.loadState);
    },
    putState: function(data, success) {
      this.props.controller.put(data, success)
    }
  });
  return InstanceControl
}
