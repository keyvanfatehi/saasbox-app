/** @jsx React.DOM */
var React = require('react');
var Resource = require('../../../resource')

var InstanceControl = React.createClass({
  getInitialState: function() {
    return {status: 'unknown'};
  },
  updateStatus: function() {
    this.resource.get(function(err, res) {
      if (err) throw err;
      this.setState({ status: res.body.status })
    }).end()
  },
  turnOn: function() {
    this.resource.put({ action: "on" }, function(err, res) {
      if (err) throw err;
    }).end()
  },
  turnOff: function() {
  },
  render: function() {
    var buttonStates = {
      on: <button onClick={this.turnOff}>Turn off</button>,
      off: <button onClick={this.turnOn}>Turn on</button>
    }
    return (
      <div>
        <p>Status: {this.state.status}</p>
        {buttonStates[this.state.status]}
      </div>
    );
  },
  componentWillMount: function() {
    this.resource = new Resource(this, '/api/v1/instance')
  },
  componentDidMount: function () {
    this.updateStatus()
  }
});
module.exports = InstanceControl
