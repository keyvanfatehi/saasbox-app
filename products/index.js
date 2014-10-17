var products = {
  strider: require('./strider')
}

if (process.env.NODE_ENV === 'development') 
  products.dev = require('./dev')

module.exports = products;
