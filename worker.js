var exec = require('child_process').exec
  , config = require('./etc/config')
  , logger = require('./src/logger')
  , mongoose = require('mongoose')
  , cluster = require('./src/cluster')
  , workers = require('./src/workers')

exec('hash ansible-playbook', function (err, stdout, stderr) {
  if (err) throw new Error('The worker requires ansible-playbook');
  else cluster(function() {
    mongoose.connect(config.mongodb);
    mongoose.connection.on('error', logger.error.bind(logger, 'err '+config.mongodb));
    workers.process()
  })
});
