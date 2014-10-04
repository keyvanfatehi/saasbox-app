/** @jsx React.DOM */
var InstanceControl = require('../../components/instance_control')(React)
  , products = require('../../../../products')
  , centsAsDollars = require('../../cents_as_dollars')
  , instanceProvisioningState = require('../../../instance_provisioning_state')
  , ChooseServerSizeAndRegion = require('./choose_server_size_and_region')
  , InputInstanceConfig = require('./input_instance_config')

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
      if (data.reload) {
        fetch(UI.loadState)
      } else {
        var state = instanceProvisioningState(data.state)
        UI.setState(state)
        if (state.error) showError(state.error);
      }
    })
  }

  var instance = null;

  var fetch = this.fetch = function(cb) {
    $.getJSON(resourcePath, function(data) {
      instance = data;
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
    ChooseServerSizeAndRegion(product, cb)
  }

  this.inputInstanceConfig = function(cb) {
    InputInstanceConfig(product, instance, cb)
  }
}

module.exports = Instance;
