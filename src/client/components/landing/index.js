/** @jsx React.DOM */
var React = require('react');
var InstanceControl = require('./instance_control')
var Landing = React.createClass({
  render: function() {
    return (
      <div>
        <InstanceControl />
      </div>
    );
  }
});
module.exports = Landing
