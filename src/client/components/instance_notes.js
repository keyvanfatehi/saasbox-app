/** @jsx React.DOM */
module.exports = function(React) {
  var InstanceNotes = React.createClass({
    render: function() {
      var propagationNote = function(fqdn, date) {
        var minutesOn = (new Date() - new Date(date)) / 1000 / 60;
        if (minutesOn > 10) return '';
        return <b>Please be patient while {fqdn} propagates.</b>
      }

      var url = 'https://'+this.props.fqdn

      var noop = function(e){}
      var select = function(e) { $(e.target).select() }
      return <div>
        <b>URL:</b>
        <input onClick={select} onChange={noop} className="form-control" type="text" value={url} />
        <b>Admin Login:</b>
        <input onClick={select} onChange={noop} className="form-control" type="text" value={this.props.login} />
        <b>Admin Password:</b>
        <input onClick={select} onChange={noop} className="form-control" type="text" value={this.props.password} />
        {propagationNote(this.props.fqdn, this.props.turnedOnAt)}
      </div>
    }
  })
  return InstanceNotes
}
