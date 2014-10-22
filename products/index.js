var productPricing = require('../src/product_pricing')
var requireDirectory = require('require-directory');
var products = requireDirectory(module);

//if (process.env.NODE_ENV === 'development') products.dev = require('./dev')

for (var key in products) {
  var product = products[key].index;
  product.slug = key
  product.__pricing = productPricing(product);
  products[key] = product;
}

module.exports = products;
