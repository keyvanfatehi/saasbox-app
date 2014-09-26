/** @jsx React.DOM */
module.exports = function(React) {
  var ProgressBar = React.createClass({
    render: function() {
      return (
        <div className="progress">
          <div className="progress-bar progress-bar-striped active"
            role="progressbar" aria-valuenow={this.props.progress}
            aria-valuemin="0" aria-valuemax="100"
            style={{width: this.props.progress+'%' }}>
            {this.props.progress}%
          </div>
        </div>
      );
    }
  });
  return ProgressBar
}
