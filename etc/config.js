module.exports = {
  test: function() { return {
    agents: {
      test: {
        ip: '127.0.0.1',
        url: 'http://localhost:5010',
        secret: 'secret'
      }
    },
    mongodb: 'mongodb://localhost/saasbox-test',
    cookie_secret: 'session-secret'
  }},
  development: function() { return {
    agents: {
      dev: {
        ip: '127.0.0.1',
        url: 'http://localhost:4000',
        secret: 'secret'
      }
    },
    mongodb: 'mongodb://localhost/saasbox-strider',
    cookie_secret: 'o3lo1s50gckp4x6rc8hzzhowmzfwp14ij1fzwc8st4oswcdi'
  }},
  production: function() { return require('/etc/saasbox/config.js') }
}[process.env.CONFIG_ENV || process.env.NODE_ENV || 'test']()
