module.exports = {
  test: function() { return {
    zone: "example.com",
    agents: {
      test: {
        ip: '127.0.0.1',
        url: 'http://localhost:5010',
        secret: 'secret'
      }
    },
    mongodb: 'mongodb://localhost/saasbox-test',
    cookie_secret: 'session-secret',
    mail: {
      transport: {
        service: 'Mailgun',
        auth: {
          user: 'postmaster@knban.com',
          pass: 'fb8e2311444a3d03301a30e43caef236'
        }
      }
    },
    mailhide: {
      publicKey: '01zlt8r3De11zvokfkp1SA9A==',
      privateKey: '9aa1f2990e57bfef18e90b90a064578c'
    }
  }},
  production: function() { return require('/etc/saasbox/config.js') }
}[(process.env.CONFIG_ENV || process.env.NODE_ENV) === 'production' ? 'production' : 'test']()
