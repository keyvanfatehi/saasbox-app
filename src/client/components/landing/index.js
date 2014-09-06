/** @jsx React.DOM */
module.exports = function (React) {
  var AccountControl = require('./account_control')(React)
  var InstanceControl = require('./instance_control')(React)
  var Landing = React.createClass({
    render: function() {
      return (
        <div>
          <h2>Instance</h2>
          <InstanceControl />
          <h2>Account</h2>
          <AccountControl />
        </div>
      );
    }
  });
  return Landing
}
