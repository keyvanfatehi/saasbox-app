var path = require('path')
  , browserify = require('browserify-middleware')
  , main = path.join(__dirname, '..', '..', 'client', 'app.js')

module.exports = browserify(main, {
  transform: [
    'reactify',
    'envify'
  ]
});
