module.exports = {
  development: {
    product: 'strider',
    agents: [{
      name: 'terranova',
      url: 'http://localhost:4000',
      secret: 'secret'
    }]
  },
  production: {}
}[process.env.NODE_ENV || 'development']
