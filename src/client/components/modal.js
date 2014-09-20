/** @jsx React.DOM */
module.exports = function(React) {
  var Modal = React.createClass({
    render: function () {
      //<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
      //<button type="button" className="btn btn-primary">Save changes</button>
      var footer = (this.props.footer ? (
        <div className="modal-footer">{this.props.footer}</div>
      ) : '')
      return (
        <div className="modal" id="myModal" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.hide}><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                <h4 className="modal-title">{this.props.title}</h4>
              </div>
              <div className="modal-body">{this.props.body}</div>
              {footer}
            </div>
          </div>
        </div>
      )
    },
    hide: function () {
      $(this.getDOMNode()).modal('hide');
    },
    componentDidMount: function () {
      var $node = $(this.getDOMNode())
      $node.on('hidden.bs.modal', function () {
        React.unmountComponentAtNode($node.parent().get(0))
      })
      var onShown = this.props.shown
      if (onShown) {
        $node.on('shown.bs.modal', function () {
          onShown($(this));
        });
      }
    },
    show: function () {
      $(this.getDOMNode()).modal('show');
    }
  });
  return Modal;
}
