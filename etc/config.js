module.exports = {
  test: {
    agents: [{
      name: 'test-agent',
      url: 'http://localhost:5010',
      secret: 'secret'
    }],
    mongodb: 'mongodb://localhost/saasbox-test',
    cookie_secret: 'session-secret'
  },
  development: {
    agents: [{
      name: 'terranova',
      url: 'http://localhost:4000',
      secret: 'secret'
    }],
    mongodb: 'mongodb://localhost/saasbox-strider',
    cookie_secret: 'o3lo1s50gckp4x6rc8hzzhowmzfwp14ij1fzwc8st4oswcdi'
  },
  production: {
    agents: [{
      name: 'the-agency',
      domain: 'knban.com',
      ip: '104.131.17.221',
      url: 'https://agency.knban.com',
      secret: 'ryxvmm876h2maemi2zh1bv1ntpujtt9zw2o0vgu3hy6i529t7fz9mrcva0dx6r'
    }],
    mongodb: 'mongodb://keyvan:qnKrXGxicnhvf7ptgqcQukeEhAuzarzcxpXiqzDWVD8GjBRevr@ds059509.mongolab.com:59509/saasbox-strider',
    cookie_secret: '02s93kh8p8wa5rk96kykjgsbnr9kke2965jo8q2zi553ik9'
  }
}[process.env.NODE_ENV || 'test']
