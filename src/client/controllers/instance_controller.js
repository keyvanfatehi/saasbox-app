/** @jsx React.DOM */
var InstanceControl = require('../components/instance_control')(React)
  , products = require('../../../products')
  , centsAsDollars = require('../cents_as_dollars');

function Instance(slug, account) {
  var UI = null
    , product = products[slug]
    , defaultCharge = 100

  this.resourcePath = '/api/v1/instance/'+slug;

  this.mountInterface = function(el) {
    var $el = $(el).get(0);
    var jsx = <InstanceControl slug={slug} product={product} controller={this} />
    UI = React.renderComponent(jsx, $el);
  }

  this.fetch = function(cb) {
    $.getJSON(this.resourcePath, cb)
  }

  this.put = function(data, onsuccess, onerror) {
    $.ajax({
      type: 'PUT', 
      url: this.resourcePath,
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
      success: onsuccess,
      error: onerror
    })
  }
}

module.exports = Instance;
