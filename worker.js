var exec = require('child_process').exec
  , cluster = require('./src/cluster')
  , workers = require('./src/workers')
  , Queue = require('bull');
 
exec('hash ansible-playbook', function (err, stdout, stderr) {
  if (err) throw new Error('The worker requires ansible-playbook');
  else cluster(function() {
    workers.process(Queue);
  })
});
