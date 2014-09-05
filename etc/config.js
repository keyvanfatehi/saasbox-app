module.exports = {
  development: {
    product: 'strider',
    agents: [{
      name: 'terranova',
      url: 'http://localhost:4000',
      secret: 'secret'
    }]
  },
  production: {
    product: 'strider',
    agents: [{
      name: 'the-agency',
      url: 'https://agency.knban.com',
      secret: 'ryxvmm876h2maemi2zh1bv1ntpujtt9zw2o0vgu3hy6i529t7fz9mrcva0dx6r'
    }]
  }
}[process.env.NODE_ENV || 'development']
