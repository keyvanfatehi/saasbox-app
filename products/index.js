var productPricing = require('../src/product_pricing')

var products = {
  'strider-1.5.0': require('./strider-1.5.0'),
  'strider-1.6.0': require('./strider-1.6.0'),
//  'shell': require('./shell') solve the digicert/ssl/shit first
}

for (var key in products) {
  var product = products[key];
  product.slug = key
  product.__pricing = productPricing(product);
  products[key] = product;
}

module.exports = products;
