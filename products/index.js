var productPricing = require('../src/product_pricing')

var products = {
  strider: require('./strider')
}

if (process.env.NODE_ENV === 'development') 
  products.dev = require('./dev')

for (var key in products) {
  var product = products[key];
  product.__pricing = productPricing(product);
}

module.exports = products;
