/** @jsx React.DOM */
var React = require('react');
var Resource = require('../../../resource')

var InstanceControl = React.createClass({
  getInitialState: function() {
    return {status: 'getting status'};
  },
  updateStatus: function() {
    this.resource.get(function(err, res) {
      this.setState({ status: res.body.status })
    }).end()
  },
  turnOn: function() {
    this.setState({ status: 'turning on' })
    this.resource.put({ status: "on" }, function(err, res) {
      this.setState({ status: res.body.status })
    }).end()
  },
  turnOff: function() {
    this.setState({ status: 'turning off' })
    this.resource.put({ status: "off" }, function(err, res) {
      this.setState({ status: res.body.status })
    }).end()
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
