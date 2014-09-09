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
  production: require('/etc/saasbox/config.js')
}[process.env.CONFIG_ENV || process.env.NODE_ENV || 'test']
