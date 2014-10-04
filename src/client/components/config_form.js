/** @jsx React.DOM */
module.exports = function(React) {
  var ConfigForm = React.createClass({
    getInitialState: function() {
      return { output: this.props.config }
    },
    render: function() {
      return (
        <form>
          {inputs}
        </form>
      )
    }
  })
}
