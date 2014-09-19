module.exports = {
  test: 'sk_test_yJ1TwVKKtI4U25OovKU6wFFj',
  production: 'sk_live_gi9UsYFSVhx9JAZ1GgYMrz0B'
}[(process.env.CONFIG_ENV || process.env.NODE_ENV) === 'production' ? 'production' : 'test']
