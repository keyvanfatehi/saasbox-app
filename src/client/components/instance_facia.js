/** @jsx React.DOM */
module.exports = function(React) {
  var InstanceFacia = React.createClass({
    render: function() {
      return (
        <div>
          <div>{this.props.title}</div>
          <div>{this.props.fqdn}</div>
          <div>Status: {this.props.status}</div>
          {this.props.body}
        </div>
      )
    }
  })
  return InstanceFacia
}
