/** @jsx React.DOM */
module.exports = function(React, createModal) {
  var Modal = require('./components/modal')(React)
  return function(err, options) {
    var title = options.title || "Error"
      , html = null, body = null;
    if (options && options.xhr) {
      if (err.status === 403) {
        message = "Validation Issues"
        var problems = JSON.parse(err.responseText).problems;
        html = JSON.stringify(problems, null, 4)
      } else {
        message = err.status+' '+err.statusText;
        html = err.responseText 
      }
    } else {
      message = err.message
      html = err.stack
    }
    body = <div>
    <p className="alert alert-danger">{message}</p>
    <pre dangerouslySetInnerHTML={{ __html: html }} />
    </div>
    createModal(<Modal className='errorModal' title={title} body={body} />).show();
  }
}
