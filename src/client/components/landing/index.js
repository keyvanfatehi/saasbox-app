/** @jsx React.DOM */
module.exports = function (React) {
  var InstanceControl = require('./instance_control')(React)
  var Landing = React.createClass({
    render: function() {
      return (
        <div>
          <InstanceControl />
        </div>
      );
    }
  });
  return Landing
}
