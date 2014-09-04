/** @jsx React.DOM */
var React = require('react');
var resource = require('../../../endpoint')('/api/v1/instance')

var InstanceControl = React.createClass({
  getInitialState: function() {
    return {status: 'unknown'};
  },
  updateStatus: function() {
    resource.get(function(err, res) {
      this.setState({ status: res.body.status })
    }.bind(this)).end()
  },
  turnOn: function() {
    request({
      method: 'POST',
      url: '/api/v1/instance/turnOn',
      json: true
    }, function (err, res) {
      if (err) throw err;
      if (res.status === 200) {
        var body = JSON.parse(res.body);
        this.setState({ status: body.status })
      }
    }.bind(this))
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
  componentDidMount: function () {
    this.updateStatus()
  }
});
module.exports = InstanceControl
