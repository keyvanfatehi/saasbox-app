/** @jsx React.DOM */
var View = require('../../components/instance')(React)
  , io = require('socket.io/node_modules/socket.io-client')
  , products = require('../../../../products')
  , instanceProvisioningState = require('../../../instance_provisioning_state')
  , InputInstanceConfig = require('../../input_instance_config')

function Instance(id, slug) {
  var UI = null
    , defaultCharge = 100
    , socket = null
    , product = products[slug]

  var resourcePath = this.resourcePath = '/api/v1/instances/'+id;

  this.mountInterface = function(el) {
    var $el = $(el).get(0);
    var jsx = <View product={product} controller={this} />
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
    socket.on(id, function(data) {
      if (data.reload) {
        fetch(UI.loadState)
      } else if (data.destroyed) {
        React.unmountComponentAtNode(UI.getDOMNode().parentNode)
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
      if (!product) product = products[data.slug]
      if (io && !socket) setupSocket(data);
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

  this.inputInstanceConfig = function(cb) {
    InputInstanceConfig(product, instance, cb)
  }
}

module.exports = Instance;
