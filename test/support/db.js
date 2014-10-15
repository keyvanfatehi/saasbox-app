var config = require('../../etc/config')
  , mongoose = require('mongoose')

mongoose.connect(config.mongodb);
mongoose.connection.on('error', function(err) {
  throw err;
})

var connected = false;

var connect = function(done) {
  if (connected) return done();
  mongoose.connection.on('connected', function() {
    connected = true;
    done()
  })
}

var truncate = function(done) {
  mongoose.connection.db.dropDatabase(function(err) {
    if (err) throw err;
    done(err)
  })
}

// connect and truncate
var setup = function(done) {
  connect(function() {
    truncate(done);
  });
}

module.exports = {
  connect: connect,
  truncate: truncate,
  setup: setup
}
