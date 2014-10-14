var config = require('../../etc/config')
  , mongoose = require('mongoose')

mongoose.connect(config.mongodb);
mongoose.connection.on('error', function(err) {
  throw err;
})

module.exports = {
  connect: function(done) {
    mongoose.connection.on('connected', done)
  },
  truncate: function(done) {
    mongoose.connection.db.dropDatabase(function(err) {
      if (err) throw err;
      done(err)
    })
  }
}
