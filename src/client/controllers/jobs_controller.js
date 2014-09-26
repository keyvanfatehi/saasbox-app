/** @jsx React.DOM */
var Jobs = require('../components/jobs')(React)

module.exports = function () {
  var UI = null;
  var jobs = []

  this.resourcePath = '/api/v1/jobs';

  this.mountInterface = function(el) {
    var $el = $(el).get(0);
    var jsx = <Jobs controller={this} jobs={jobs} />
    UI = this.UI = React.renderComponent(jsx, $el);
  }

  this.fetch = function(cb) {
    $.getJSON(this.resourcePath, function(data) {
      jobs = data.keys
      UI.setProps({ jobs: jobs })
    })
  }
}
