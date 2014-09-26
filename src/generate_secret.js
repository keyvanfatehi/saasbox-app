var crypto = require('crypto')

module.exports = function() {
  return crypto.createHash('sha256').update(Math.random().toString()).update('salt').digest('hex');
}
