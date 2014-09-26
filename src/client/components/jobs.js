/** @jsx React.DOM */
module.exports = function(React) {
  var Jobs = React.createClass({
    render: function() {
      var head = <tr>
        <th>id</th>
        <th>type</th>
        <th>status</th>
        <th>progress</th>
        <th>manage</th>
      </tr>
      var rows = [];
      this.props.jobs.forEach(function(job) {
        rows.push(
          <tr key={job.id}>
            <td>{job.id}</td>
            <td>{job.type}</td>
            <td>{job.status}</td>
            <td>{job.progress}</td>
            <td>delete, reload</td>
          </tr>
        )
      });
      return (
        <table className='table'>
          <thead>
            {head}
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      )
    },
    componentWillMount: function() {
      this.props.controller.fetch()
    }
  });
  return Jobs
}
