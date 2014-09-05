/** @jsx React.DOM */
module.exports = function(React) {
  var path = '/api/v1/instance';
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
      console.log(data)
      this.setState({ status: data.status })
    },
    turnOn: function() {
      this.setState({ status: 'turning on' })
      put({ status: 'on' }, this.loadState)
    },
    turnOff: function() {
      this.setState({ status: 'turning off' })
      put({ status: 'off' }, this.loadState)
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
      $.getJSON(path, this.loadState);
    }
  });
  return InstanceControl
}
