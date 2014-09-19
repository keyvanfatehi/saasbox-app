/** @jsx React.DOM */
var stripePublicKey = require('../../../etc/stripe.pub')

module.exports = function(React) {
  var Modal = React.createClass({
    render: function () {
      //<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
      //<button type="button" className="btn btn-primary">Save changes</button>
      var footer = (this.props.footer ? (
        <div className="modal-footer">{this.props.footer}</div>
      ) : '')
      return (
        <div className="modal fade" id="myModal" aria-hidden="true">
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
    setBody: function (body) {
      this.setProps({ body: body });
    },
    hide: function () {
      $(this.getDOMNode()).modal('hide');
    },
    componentDidMount: function () {
      var node = this.getDOMNode()
      $(node).on('hidden.bs.modal', function () {
        React.unmountComponentAtNode($(node).parent().get(0))
      })
    },
    show: function () {
      var $el = $(this.getDOMNode())
      setTimeout(function () {
        $el.modal('show');
      }, 500); // delay to mitigate animation glitches
    }
  });

  var BillingInfo = React.createClass({
    render: function() {
      var style = this.props.email ? {} : { display: 'none' }
      return (
        <div>
          <a href="#" style={style} onClick={this.beginStripeFlow}>
            {this.props.billingInfoOk ? 'Change' : 'Setup'} Credit Card
          </a>
          <div id="billingModal" />
        </div>
      )
    },
    beginStripeFlow: function() {
      var account = this.props.controller;
      var amount = 123;
      account.fetch(function(data) {
        StripeCheckout.open({
          key: stripePublicKey,
          name: "FTC, LLC",
          description: "This charge is automatically refunded.",
          email: data.email,
          amount: amount,
          panelLabel: "Verify Card",
          allowRememberMe: true,
          token: function (token) {
            console.log('finish stripe flow', token);
            account.chargeAndSaveCard(token, amount, function(err) {
              var modal = createModal(<Modal title="Credit Card Setup" />);
              if (err) {
                modal.setBody(
                  <div>
                    Your card has not been charged.
                    <p className="alert alert-warning" 
                      dangerouslySetInnerHTML={{
                        __html: err.message
                      }}
                    />
                  </div>
                )
              } else {
                modal.setBody(
                  <div>
                    You have been charged a small amount that will be automatically refunded.
                  </div>
                )
              }
              modal.show()
            })
          }
        })
      })
    }
  })
  return BillingInfo;
}
