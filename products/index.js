var productPricing = require('../src/product_pricing')

var products = {
  'strider': require('./strider')
//  'shell': require('./shell') // solve the digicert/ssl/shit XXX
}

for (var key in products) {
  var product = products[key];
  product.slug = key
  product.__pricing = productPricing(product);
  products[key] = product;
}

module.exports = products;
