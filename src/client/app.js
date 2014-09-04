/** @jsx React.DOM */
var React = require('react')

// Load React Chrome Dev Tools in development
if (process.env.NODE_ENV === 'development') {
  window.React = React
}

var Landing = require('./components/landing');

window.manifest = function () {
  React.renderComponent(<Landing />, document.body)
}
