var Agent = require('../server/agent')
  , logger = require('../logger')
  , Promise = require('bluebird')

/* Now we need to get a hold of the Agent and tell it to apply the ydm drop.
 * ydm will pull images if necessary, if we get hung up that's fine, we safely retry. */
var retry = module.exports = function(options) {
  return new Promise(function (resolve, reject) {
    var instance = options.instance;
    var agent = new Agent(instance.agent);
    var bumpProgress = options.bumpProgress || function(){};

    var log = function(level, msg, stack) {
      var meta = { ydm: 'apply' }
      if (stack) meta.stack = stack;
      logger[level](agent.identifier+': '+msg, meta);
    }

    var tryAgainSoon = function() {
      var secs = 6
      log('info', 'retrying in '+secs+' seconds')
      setTimeout(function() {
        resolve(retry(options)) 
      }, secs*1000);
    }

    log('info', 'setting up container')

    var pulling = null;
    var body = null;

    var handleInstallAttempt = function(err) {
      if (err) {
        log('warn', 'install attempt resulted in an error '+err.stack)
        return tryAgainSoon();
      } if (pulling) {
        log('warn', 'ydm is busy pulling images')
        return tryAgainSoon()
      } else if (body && body.app) {
        instance.setTurnedOnNow()
        instance.setInstallNotes(body)
        instance.save(function (err) {
          if (err) return reject(err);
          logger.info('creating proxy from '+instance.fqdn+' to '+body.app.url)
          agent.createProxy(instance.fqdn, body.app.url, function(err) {
            if (err) return reject(err);
            else resolve(body);
          })
        })
      } else {
        log('warn', 'ydm did not populate body with required key "app"');
        return tryAgainSoon()
      }
    }

    instance.setupDrops(agent, {/* drop configuration options */}, function(err) {
      if (err) return reject(err);
      var stream = instance.performInstall(agent, handleInstallAttempt);

      stream.on('data', function(chunk) {
        pulling = (stream.request.res.headers['x-pullstream'] === 'yes')
        if (pulling) {
          var data = JSON.parse(chunk.toString());
          if (data.error) {
            log('error', "Pull failure. Error: "+data.error, data)
          } else if (/complete/.test(data.status)) {
            bumpProgress()
            log('info', data.status);
          }
        } else {
          body = chunk;
        }
      })

      stream.on('error', function (err) {
        log('error', err.message, err.stack)
      })
    })
  })
}
