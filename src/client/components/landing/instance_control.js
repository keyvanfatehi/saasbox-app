/** @jsx React.DOM */
var React = require('react');
var resource = require('../../../endpoint')('/api/v1/instance')

var InstanceControl = React.createClass({
  getInitialState: function() {
    return {status: 'unknown'};
  },
  updateStatus: function() {
    resource.get(function(err, res) {
      this.setState({ status: JSON.parse(res.body).status })
    }.bind(this), { buffer: true }).end()
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
    onButton = <button onClick={this.turnOn}>Turn on</button>
    offButton = <button onClick={this.turnOff}>Turn off</button>
    return (
      <div>
        <p>Status: {this.state.status}</p>
        {this.state.status === 'on' ? offButton : onButton}
      </div>
    );
  },
  componentDidMount: function () {
    this.updateStatus()
  }
});
module.exports = InstanceControl
