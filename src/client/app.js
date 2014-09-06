/** @jsx React.DOM */
var Landing = require('./components/landing')(React);

window.startReactApp = function(options) {
  React.renderComponent(<Landing />, options.mountNode);
}
