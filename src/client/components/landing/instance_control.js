/** @jsx React.DOM */
var request = require('browser-request')

var InstanceControl = React.createClass({
  getInitialState: function() {
    return {status: 'unknown'};
  },
  startInstance: function () {
    //    request({ method: 'POST', )
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
    request('/api/v1/instance', function (err, res) {
      if (err) throw err;
      if (res.status === 200) {
        var body = JSON.parse(res.body);
        this.setState({ status: body.status })
      }
    }.bind(this))
  }
});
module.exports = InstanceControl
