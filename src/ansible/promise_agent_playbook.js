var logger = require('../logger')
  , path = require('path')
  , spawn = require('child_process').spawn
  , playbookPath = path.join(__dirname, '..', '..', 'playbook')
  , Promise = require('bluebird')
  , config = require('../../etc/config')
  , appRoot = path.join(__dirname, '..', '..')
  , privKeyPath = path.join(appRoot, config.ssh.privateKeyPath)

module.exports = function(options) {
  return new Promise(function(resolve, reject) {
    var instance = options.instance;
    var bumpProgress = options.bumpProgress;
    var failAfter = options.maxRetries || 10
    var agent = instance.agent;

    logger.info('Loaded ansible playbook for agent role')

    var env = {
      IP: agent.public_ip,
      NAME: agent.name,
      SECRET: agent.secret,
      PYTHONUNBUFFERED: 'True',
      ANSIBLE_HOST_KEY_CHECKING: 'False',
      ANSIBLE_CONFIG: path.join(playbookPath, 'ansible.cfg'),
      ANSIBLE_PRIVATE_KEY_FILE: privKeyPath
    }

    var provision = function(attempt, args) {
      args = args || []
      logger.info('Agent provisioning started, attempt #'+attempt)
      var proc = spawn('./mkagent', args, { cwd: playbookPath, env: env })
      var log = function(level, data) {
        var msg = data.toString().trim()
        if (msg.length > 0)
          logger[level]('ansible: '+data.toString().trim())
        if (bumpProgress && level === 'info' && /TASK/.test(msg)) {
          bumpProgress()
        }
      }
      proc.stdout.on('data', function(data) {
        log('info', data)
      })
      proc.stderr.on('data', function(data) {
        log('error', data)
      })
      proc.on('error', function (err) {
        log('error', err.message);
      })
      proc.on('close', function (code) {
        if (code === 0) {
          instance.update({ agent: agent }, function(err) {
            if (err) return reject(err);
            else return resolve()
          })
        } else {
          if (attempt < failAfter) {
            logger.warn('ansible exited with code ' + code + ' and will retry verbosely');
            provision(attempt+1, ['-vvvv'])
          } else {
            logger.warn('ansible exited with code ' + code + ' and will NOT retry');
            reject(new Error('Could not provision instance after '+failAfter+' attempts. Please see logs.'))
          }
        }
      });
    }

    provision(1)
  });
}
