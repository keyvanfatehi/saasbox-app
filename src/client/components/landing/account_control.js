/** @jsx React.DOM */
module.exports = function(React) {
  var centsAsDollars = require('./cents_as_dollars');

  var AccountControl = React.createClass({
    render: function() {
      return (
        <div>
          <p>Balance: ${centsAsDollars(this.props.balance)}</p>
          Pay balance, etc.
        </div>
      );
    }
  });
  return AccountControl
}
