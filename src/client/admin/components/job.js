/** @jsx React.DOM */
module.exports = function(React) {
  var Job = React.createClass({
    render: function() {
      var states = {
        active: <div>
          <button onClick={this.deleteJob}>Delete</button>
          <button onClick={this.revertToPending}>Revert to Pending</button>
        </div>
      }
      return (
        <tr>
          <td>{this.props.id}</td>
          <td>{this.props.type}</td>
          <td>{this.props.status}</td>
          <td>{this.props.progress}</td>
          <td>{states[this.props.status]}</td>
        </tr>
      )
    },
    deleteJob: function() {
      this.props.handler.fn.deleteById(this.props)
    },
    revertToPending: function() {
      this.props.handler.fn.pendingById(this.props)
    }
  });
  return Job
}
