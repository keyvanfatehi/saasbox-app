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
    if (process.env.SKIP_ANSIBLE)
      return resolve(options);
    var instance = options.instance;
    var bumpProgress = options.bumpProgress;
    var failAfter = options.maxRetries || 10
    var agent = instance.agent;

    var env = {
      IP: agent.public_ip,
      NAME: agent.name,
      HOST_GROUP: options.hostGroup || 'agents',
      PLAYBOOK_FILE: options.playbookFile || path.join(playbookPath, 'site.yml'),
      SECRET: agent.secret,
      PYTHONUNBUFFERED: 'True',
      ANSIBLE_HOST_KEY_CHECKING: 'False',
      ANSIBLE_CONFIG: path.join(playbookPath, 'ansible.cfg'),
      ANSIBLE_PRIVATE_KEY_FILE: privKeyPath
    }

    var provision = function(attempt, args) {
      args = args || []
      var label = 'runPlaybook'
      logger.info('playbook run started, attempt #'+attempt, {
        ansible: label,
        dir: playbookPath,
        env: env
      })
      var proc = spawn('./mkagent', args, { cwd: playbookPath, env: env })
      var log = function(level, data, stack) {
        var msg = data.toString().trim()
        if (msg.length > 0) {
          var meta = { ansible: label }
          if (stack) meta.stack = stack;
          logger[level](data.toString().trim(), meta)
        }
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
        log('error', err.message, err.stack);
      })
      proc.on('close', function (code) {
        if (code === 0) {
          instance.update({ agent: agent }, function(err) {
            if (err) return reject(err);
            else return resolve(options)
          })
        } else {
          if (attempt < failAfter) {
            log('warn', 'exited with code ' + code + ' and will retry verbosely');
            provision(attempt+1, ['-vvvv'])
          } else {
            log('warn', 'exited with code ' + code + ' and will NOT retry');
            reject(new Error('Could not provision instance after '+failAfter+' attempts. Please see logs.'))
          }
        }
      });
    }

    provision(1)
  });
}
