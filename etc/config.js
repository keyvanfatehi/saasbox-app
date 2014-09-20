module.exports = {
  test: function() { return {
    zone: "example.com",
    mongodb: 'mongodb://localhost/saasbox-test',
    cookie_secret: 'session-secret',
    digitalocean: {
      token: 'ecf230d45015b9864cd7212fe688f0bfd3b4771074b2449298642bc761ff94e0'
    },
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
    nautical: {
      token: "ed803243f805ea45650fa310729823dca750d28b793e901a09b74472848e273f"
    }
  }},
  production: function() { return require('/etc/saasbox/config.js') }
}[(process.env.CONFIG_ENV || process.env.NODE_ENV) === 'production' ? 'production' : 'test']()
