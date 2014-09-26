var path = require('path')
  , browserify = require('browserify-middleware')
  , main = path.join(__dirname, '..', '..', 'client', 'index.js')
  , admin = path.join(__dirname, '..', '..', 'client', 'admin', 'index.js')

var options = {
  transform: [
    'reactify',
    'envify',
    'browserify-ejs'
  ]
}

module.exports = {
  mainBundle: browserify(main, options),
  adminBundle: browserify(admin, options)
}
