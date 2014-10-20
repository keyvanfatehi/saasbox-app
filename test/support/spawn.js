var spawn = require('child_process').spawn

module.exports = {
  manage: manage
}

/* Takes a config object, like
 * {
    cmd: 'node',
    args: [ __dirname+'/../../server.js' ]
    env: { PORT: 49991, PATH: process.env.PATH },
    match: /listening/
   }
 * and setups up before and after
 */
function manage(config) {
  before(function(done) {
    this.timeout(10000)
    proc = spawn(config.cmd, config.args, {
      env: config.env
    })
    proc.stdout.on('data', function(chk) {
      if (config.match.test(chk)) { 
        proc.stdout.removeAllListeners();
        done();
      }
    })
  });

  after(function(done) {
    proc.on('exit', function() {
      done();
    })
    proc.kill('SIGTERM')
  })
}

