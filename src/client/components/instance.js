/** @jsx React.DOM */
module.exports = function(React) {
  var ProgressBar = require('./progress_bar')(React);
  var InstanceFacia = require('./instance_facia')(React);
  var InstanceNotes = require('./instance_notes')(React);
  var getInstanceBalance = require('../../instance_balance');
  var instanceCost = require('../../instance_cost');
  var dollar = require('../../cent_to_dollar');

  var Instance = React.createClass({
    getInitialState: function() {
      return {loading: true, status: 'getting status'};
    },
    updateBalance: function() {
      this.setState({ balance: dollar(getInstanceBalance(this.state)) })
    },
    updateRate: function() {
      this.setState({ hourlyRate: dollar(instanceCost(this.state.size.cents).hourly.cents) })
    },
    loadState: function(state) {
      state.loading = false
      state.status = state.status || 'queued'
      this.setState(state)
      if (state.status === 'on') {
        this.updateRate()
        if (this.state.interval) clearInterval(this.state.interval);
        this.state.interval = setInterval(this.updateBalance, 5000)
        this.updateBalance()
      }
    },
    turnOn: function() {
      var commit = function(newState) {
        this.setState({ status: 'turning on' })
        this.putState(newState, this.loadState)
      }.bind(this)
      this.setState({ status: 'Waiting for server selection' })
      if (this.props.product.configSchema) {
        this.setState({ status: 'Waiting for configuration' })
        this.props.controller.inputInstanceConfig(function(err, config) {
          if (err) {
            this.setState({ status: 'off' });
          } else {
            commit({ status: 'on', config: config })
          }
        }.bind(this))
      } else {
        commit({ status: 'on' })
      }
    },
    destroy: function() {
      analytics.track('Might Destroy Instance')
      var ok = confirm('WARNING!!!\nAre you sure you want to destroy '+this.state.fqdn+'?\nThis action cannot be undone!')
      if (ok) {
        analytics.track('Destroying Instance')
        this.setState({ status: 'destroying' })
        clearInterval(this.state.interval);
        this.putState({ status: 'destroy' })
      }
    },
    reconfigure: function() {
      this.props.controller.inputInstanceConfig(function(err, config) {
        if (err) return false;
        var newState = { status: 'reconfigure', config: config }
        this.putState(newState, function(data) {
          this.loadState(data)
          alert('New configuration applied!')
        }.bind(this))
      }.bind(this))
    },
    openInterface: function() {
      window.open('https://'+this.state.fqdn);
    },
    showStateError: function() {
      this.props.controller.showError(this.state.error);
    },
    render: function() {
      var state = this.state;
      var balance = <div>Balance: ${this.state.balance} <small>(${this.state.hourlyRate}/hr)</small></div>

      var status = <div>
        Status: {this.state.loading ? 
          "Loading..." : 
          this.state.status 
        }
        { this.state.delayReason ? 
          ' ('+this.state.delayReason+')' :
          ''
        }
      </div>

      var viewStates = {
        on: <div>
          {balance}
          {state.notes ?
            <InstanceNotes
              fqdn={state.fqdn}
              login={state.notes.admin.login}
              password={state.notes.admin.password}
              turnedOnAt={state.turnedOnAt}
            />
          : ''}
          <button onClick={this.destroy}>Destroy</button>
          {this.props.product.configSchema ?
            <button onClick={this.reconfigure}>Reconfigure</button>
          : '' }
          { false ? <button onClick={this.restart}>Restart</button> : '' }
          <button onClick={this.openInterface}>Open</button>
        </div>,
        off: <div>
          <button onClick={this.turnOn}>Activate</button>
          {this.state.error ? 
            <button onClick={this.showStateError}>Show Error</button>
          : '' }
        </div>,
        provisioning: <ProgressBar progress={this.state.progress}/>
      }

      return <InstanceFacia
        title={this.props.product.title}
        status={this.state.status}
        fqdn={this.state.fqdn}
        body={viewStates[this.state.status]}
      />
    },
    componentWillMount: function () {
      this.props.controller.fetch(this.loadState);
    },
    putState: function(data, success) {
      this.props.controller.put(data, success)
    }
  });
  return Instance
}
