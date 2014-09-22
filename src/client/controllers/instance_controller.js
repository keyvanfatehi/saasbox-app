/** @jsx React.DOM */
var InstanceControl = require('../components/instance_control')(React)
  , products = require('../../../products')
  , centsAsDollars = require('../cents_as_dollars')
  , tierData = require('../../../etc/price_matrix')
  , regionData = require('../../../etc/regions')
  , tierTemplate = require('../../../views/shared/price_matrix.ejs')
  , regionTemplate = require('../../../views/shared/regions.ejs')
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

  var showError = this.showError = function(err, options) {
    var options = options || {};
    window.errorModal(err, {
      xhr: options.xhr,
      title: product.title+ " Instance Errors"
    })
  }

  var setupSocket = function(instance) {
    socket = io()
    var event = slug+'ProvisioningStateChange'
    socket.on(event, function(data) {
      var state = instanceProvisioningState(data.state)
      console.log(state);
      UI.setState(state)
      if (state.error) showError(state.error);
    })
  }

  var fetch = this.fetch = function(cb) {
    $.getJSON(resourcePath, function(data) {
      if (data._id && !socket) setupSocket(data);
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

  this.chooseServerSizeAndRegion = function(cb) {
    var tiers = { __html: tierTemplate({ priceMatrix: tierData }) }
    var regions = { __html: regionTemplate({ regions: regionData }) }
    var size = null;
    var region = null;
    var modal = null;
    var body = <div>
      <h2>Choose a server size</h2>
      <div dangerouslySetInnerHTML={tiers} />
      <h2>Choose a region</h2>
      <div dangerouslySetInnerHTML={regions} />
    </div>
    modal = createModal(<Modal 
      className='serverSelectModal'
      title="Server Selection"
      body={body}
      onShown={function($el) {
        var submit = $el.find('button[type=submit]')
        var updateButton = function() {
          if (size && region) submit.removeAttr('disabled').click(modal.hide)
        }
        var sizeChoices = $el.find('[data-size]')
        var regionChoices = $el.find('[data-region]')

        sizeChoices.each(function() {
          var memory = parseInt($(this).data('memory'))
          if (product.minMemory && memory < product.minMemory) {
            $(this).addClass('insufficient').tooltip({
              title: "The application's minimum memory requirements exceed this flavor."
            })
          } else {
            $(this).addClass('choice')
          }
        }).click(function() {
          sizeChoices.removeClass('selected')
          if ($(this).hasClass('insufficient')) return;
          $(this).addClass('selected')
          size = $(this).data('size')
          updateButton()
        })

        regionChoices.each(function() {
          $(this).addClass('choice')
        }).click(function() {
          regionChoices.removeClass('selected')
          $(this).addClass('selected')
          region = $(this).data('region')
          updateButton()
        })
      }}
      footer={
        <div>
          <button type="submit" disabled className="btn btn-primary">Submit</button>
          <button type="button" className="pull-left btn btn-default" data-dismiss="modal">Cancel</button>
        </div>
      }
      onHidden={function() {
        if (size && region) {
          cb(null, size, region)
        } else {
          cb(new Error('No selection'))
        }
      }}
    />)
    modal.show();
  }
}

module.exports = Instance;
