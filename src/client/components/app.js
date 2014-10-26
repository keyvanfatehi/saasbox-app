/** @jsx React.DOM */
var products = require('../../../products')
module.exports = function(React) {
  var App = React.createClass({
    render: function() {
      var slug = this.props.slug
      var product = products[slug]
      return (
        <div className="app" onClick={this.props.onClick}>
          <img className="small logo pull-right" src={'/apps/'+slug+'/icon.png'} />
          <div>
            <span className="title">{product.title}</span>
            <span className="version">{product.version}</span>
          </div>
          <span className="description">{product.description}</span>
        </div>
      )
    }
  })
  return App
}
