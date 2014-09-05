/** @jsx React.DOM */
$(function() {
  var Landing = require('./components/landing')(React);
  React.renderComponent(<Landing />, document.body)
})
