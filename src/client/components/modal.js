/** @jsx React.DOM */
module.exports = function(React) {
  var Modal = React.createClass({
    render: function () {
      var modalClass = 'modal '+(this.props.className || '')
      var defaultFooter = <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
      return (
        <div className={'modal '+modalClass} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                  <span className="sr-only">Close</span>
                </button>
                <h4 className="modal-title">{this.props.title}</h4>
              </div>
              <div className="modal-body">{this.props.body}</div>
              <div className="modal-footer">
                {this.props.footer ? this.props.footer : defaultFooter}
              </div>
            </div>
          </div>
        </div>
      )
    },
    componentDidMount: function () {
      var $node = $(this.getDOMNode())
      $node.on('hidden.bs.modal', function () {
        var rootNode = $node.parent().get(0);
        React.unmountComponentAtNode(rootNode)
        $(rootNode).remove();
      })

      var onShown = this.props.onShown
      if (onShown) $node.on('shown.bs.modal', function () { onShown($(this)) });

      var onHidden = this.props.onHidden
      if (onHidden) $node.on('hidden.bs.modal', onHidden);
    },
    hide: function() {
      $(this.getDOMNode()).modal('hide');
    },
    show: function () {
      $(this.getDOMNode()).modal({
        backdrop: false,
        keyboard: true,
        show: true
      });
    }
  });
  return Modal;
}
