var logger = require('../logger')
  , path = require('path')
  , spawn = require('child_process').spawn
  , playbookPath = path.join(__dirname, '..', '..', 'playbook')
  , Promise = require('bluebird')
  , config = require('../../etc/config')
  , appRoot = path.join(__dirname, '..', '..')
  , privKeyPath = path.join(appRoot, config.ssh.privateKeyPath)

module.exports = function(instance, bumpProgress) {
  var agent = instance.agent;
  return new Promise(function(resolve, reject) {
    logger.info('Loaded ansible playbook for agent role')
    var failAfter = 10;

    var provision = function(attempt) {
      logger.info('Agent provisioning started, attempt #'+attempt)
      var proc = spawn('./mkagent', [], {
        cwd: playbookPath,
        env: {
          IP: agent.public_ip,
          NAME: agent.name,
          SECRET: agent.secret,
          IMAGE: 'niallo/strider:latest',
          PYTHONUNBUFFERED: 'True',
          ANSIBLE_HOST_KEY_CHECKING: 'False',
          ANSIBLE_CONFIG: path.join(playbookPath, 'ansible.cfg'),
          ANSIBLE_PRIVATE_KEY_FILE: privKeyPath
        }
      })
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
      proc.on('close', function (code) {
        if (code === 0) {
          agent.provisioned = true;
          instance.update({ agent: agent }, function(err) {
            if (err) return reject(err);
            else return resolve()
          })
        } else {
          if (attempt === failAfter) {
            logger.warn('ansible exited with code ' + code + ' and will NOT retry');
            reject(new Error('Could not provision instance after '+failAfter+' attempts. Please see logs.'))
          } else {
            logger.warn('ansible exited with code ' + code + ' and will retry');
            provision(attempt+1)
          }
        }
      });
    }

    if (agent.provisioned) {
      logger.info('agent already provisioned')
      return resolve();
    } else {
      provision(1)
    }

  });
}
