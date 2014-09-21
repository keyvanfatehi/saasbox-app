module.exports = {
  test: function() { return {
    zone: "example.com",
    mongodb: 'mongodb://localhost/saasbox-test',
    redis: {
      host: "127.0.0.1",
      port: 6379,
      options: {
        // Options listed at https://github.com/mranney/node_redis
        auth_pass: null // Set it to the password or leave it as null which is default
      }
    },
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
    },
    digitalocean: {
      token: 'ecf230d45015b9864cd7212fe688f0bfd3b4771074b2449298642bc761ff94e0'
    }
  }},
  production: function() { return require('/etc/saasbox/config.js') }
}[(process.env.CONFIG_ENV || process.env.NODE_ENV) === 'production' ? 'production' : 'test']()
