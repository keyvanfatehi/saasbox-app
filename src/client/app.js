/** @jsx React.DOM */
if (process.env.NODE_ENV) {
  window.React = require('react')
}

var Landing = require('./components/landing');

window.manifest = function () {
  React.renderComponent(<Landing />, document.body)
}
