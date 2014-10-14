var config = require('./etc/config')
  , logger = require('./src/logger')
  , mongoose = require('mongoose')
  , cluster = require('./src/cluster')
  , enforcer = require('./src/enforcer')

cluster(function() {
  mongoose.connect(config.mongodb);
  mongoose.connection.on('error', logger.error.bind(logger, 'err '+config.mongodb));
  enforcer.daily();
  enforcer.monthly();
}, 1)
