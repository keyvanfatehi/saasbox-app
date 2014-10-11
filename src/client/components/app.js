/** @jsx React.DOM */
var products = require('../../../products')
module.exports = function(React) {
  var App = React.createClass({
    render: function() {
      var slug = this.props.slug
      var product = products[slug]
      return (
        <div className="app">
          <img className="small logo pull-right" src={'/img/app_logos/'+slug+'.png'} />
          <span className="title">{product.title}</span>
          <span className="description">{product.description}</span>
        </div>
      )
    }
  })
  return App
}
