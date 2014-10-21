var priceMatrix = require('../etc/price_matrix')
var dollar = require('./cent_to_dollar')

module.exports = function(product) {
  var app_price = product.monthlyPremium || 0
  var smallest = function() {
    if (product.minMemory) { 
      for (var key in priceMatrix) {
        var size = priceMatrix[key]
        if (size.memory >= product.minMemory) {
          return size
        }
      }
    } else {
      return priceMatrix[Object.keys(priceMatrix)[0]]
    }
  }()
  var ram = product.minMemory || smallest.memory
  var hdd = product.minStorage || smallest.storage
  var cents = smallest.cents+app_price
  return {
    size: smallest,
    cents: cents,
    dollars: dollar(cents)
  }
  return 
}
