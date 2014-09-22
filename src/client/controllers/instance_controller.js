/** @jsx React.DOM */
var InstanceControl = require('../components/instance_control')(React)
  , products = require('../../../products')
  , centsAsDollars = require('../cents_as_dollars')
  , tierData = require('../../../etc/price_matrix')
  , tierTemplate = require('../../../views/shared/price_matrix.ejs')
  , Modal = require('../components/modal')(React)
  , instanceProvisioningState = require('../../instance_provisioning_state')

function Instance(slug, account, io) {
  var UI = null
    , product = products[slug]
    , defaultCharge = 100
    , socket = null

  var resourcePath = this.resourcePath = '/api/v1/instance/'+slug;

  this.mountInterface = function(el) {
    var $el = $(el).get(0);
    var jsx = <InstanceControl slug={slug} product={product} controller={this} />
    UI = React.renderComponent(jsx, $el);
  }

  var showError = function(err, xhr) {
    if (!err) return;
    var title = product.title+ " Instance Errors"
      , html = null, body = null;
    if (xhr) {
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
    console.log('shwing error', err);
    createModal(<Modal title={title} body={body} />).show();
  }

  var setupSocket = function(instance) {
    socket = io()
    var event = 'Instance:'+instance._id+':ProvisioningStateChange'
    socket.on(event, function(data) {
      UI.setState(instanceProvisioningState(data.state))
      showError(data.state.error);
    })
    console.log('subscribed to '+event);
  }

  var fetch = this.fetch = function(cb) {
    $.getJSON(resourcePath, function(data) {
      if (data._id && !socket) setupSocket(data);
      showError(data.error);
      cb(data)
    })
  }

  this.put = function(data, onsuccess, onerror) {
    $.ajax({
      type: 'PUT', 
      url: this.resourcePath,
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
      success: onsuccess,
      error: function(err) {
        showError(err, { xhr: true })
        fetch(function(data) {
          UI.setState({ status: data.status });
        })
      }
    })
  }

  this.chooseServerSize = function(cb) {
    var raw = { __html: tierTemplate({ priceMatrix: tierData }) }
    var slug = null;
    var body = <div>
      Choose a server size
      <div dangerouslySetInnerHTML={raw} />
    </div>
    var modal = createModal(<Modal 
      className='serverSelectModal'
      title="Server Selection"
      body={body}
      onShown={function($el) {
        var choices = $el.find('[data-slug]')
        choices.each(function() {
          var memory = parseInt($(this).data('memory'))
          if (product.minMemory && memory < product.minMemory) {
            $(this).addClass('insufficient').tooltip({
              title: "The application's minimum memory requirements exceed this flavor."
            })
          } else {
            $(this).addClass('sufficient')
          }
        }).click(function() {
          if ($(this).hasClass('insufficient')) return;
          slug = $(this).data('slug')
          modal.hide();
        })
      }}
      onHidden={function() {
        if (slug) {
          cb(null, slug)
        } else {
          cb(new Error('No selection'))
        }
      }}
    />)
    modal.show();
  }
}

module.exports = Instance;
