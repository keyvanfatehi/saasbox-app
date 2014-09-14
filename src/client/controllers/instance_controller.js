/** @jsx React.DOM */
var InstanceControl = require('../components/instance_control')(React)
  , products = require('../../../products')

function Instance(slug) {
  this.resourcePath = '/api/v1/instance/'+slug;
  var product = products[slug];
  var attributes = this.attributes = {};
  this.fetch = function(cb) {
    $.getJSON(this.resourcePath, function(data) {
      attributes = data;
      cb(data);
    });
  },
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
  this.mountInterface = function(el) {
    var $el = $(el).get(0);
    var jsx = <InstanceControl slug={slug} product={product} controller={this} />
    React.renderComponent(jsx, $el);
  }
}

module.exports = Instance;
