var fs = require('fs')
  , path = require('path')

module.exports = {
  title: 'Strider',
  slug: 'strider',
  pricePerHour: 0.05,
  ydm: fs.readFileSync(path.join(__dirname, 'ydm.js')).toString()
}
