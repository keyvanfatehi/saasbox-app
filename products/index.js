var productPricing = require('../src/product_pricing')

var products = {
  'strider': require('./strider'),
//  'sentry': require('./sentry'), // probably next on the list
//  'gitlab': require('./gitlab'), // not much incentive to do this since gitlab.com is free :]
//  'shell': require('./shell') // solve the digicert/ssl/shit before offering someting like this
}

for (var key in products) {
  var product = products[key];
  product.slug = key
  product.__pricing = productPricing(product);
  products[key] = product;
}

module.exports = products;
