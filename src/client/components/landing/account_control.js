/** @jsx React.DOM */
module.exports = function(React) {
  var path = '/api/v1/account';
  var centsAsDollars = require('./cents_as_dollars');

  var AccountControl = React.createClass({
    getInitialState: function() {
      return { balance: null };
    },
    loadState: function(data) {
      this.setState({ balance: data.balance })
    },
    render: function() {
      return (
        <div>
          <p>Balance: ${centsAsDollars(this.state.balance)}</p>
          Pay balance, etc.
        </div>
      );
    },
    componentDidMount: function () {
      $.getJSON(path, this.loadState);
    }
  });
  return AccountControl
}
