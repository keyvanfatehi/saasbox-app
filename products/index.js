var slugList = [
  'sentry',
  'strider'
]

var products = module.exports = {};
slugList.forEach(function(slug) {
  var product = require('./'+slug);
  product.slug = slug;
  products[slug] = product;
})
