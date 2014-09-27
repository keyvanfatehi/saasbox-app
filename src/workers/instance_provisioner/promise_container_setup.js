var Account = require('../../server/models').Account
  , Agent = require('../../server/agent')
  , logger = require('../../logger')
  , Promise = require('bluebird')

/* Now we need to get a hold of the Agent
 * and tell it to download required images for this product
 * at the current or latest (if no current version is set) tags.
 */
var retry = module.exports = function(options) {
  return new Promise(function (resolve, reject) {
    var instance = options.instance;
    var agent = new Agent(instance.agent);
    var bumpProgress = options.bumpProgress || function(){};

    var log = function(level, msg) {
      logger[level](agent.identifier+': '+msg)
    }

    log('info', 'setting up container')

    var pulling = null;
    var body = null;

    var handleResponse = function(err) {
      if (err) return reject(err);
      if (pulling) {
        log('info', 'retrying now!')
        resolve(retry(options))
      } else {
        instance.turnedOffAt = null;
        instance.turnedOnAt = new Date();
        instance.notes = {
          admin: {
            login: body.app.login,
            password: body.app.password
          }
        }
        agent.createProxy(instance.fqdn, body.app.url, function (err) {
          if (err) return reject(err);
          log('info', 'proxy created: '+instance.fqdn)
          instance.save(function (err) {
            if (err) return reject(err);
            resolve(body);
          })
        })
      }
    }

    var stream = agent.perform('install', instance.slug, {
      namespace: instance.name,
      fqdn: instance.fqdn
    }, handleResponse)
    
    stream.on('data', function(chunk) {
      if (pulling === null) {
        pulling = (stream.request.res.headers['x-pullstream'] === 'yes')
      }
      if (pulling) {
        var data = JSON.parse(chunk.toString());
        if (data.error) {
          err = new Error("Pull failed. "+data.error)
        } else {
          if (data.progress) {
            log('info', data.progress);
          } else {
            if (/complete/.test(data.status)) bumpProgress()
              log('info', data.status);
          }
        }
      } else {
        body = chunk;
      }
    })

    stream.on('error', function (err) { reject(err) })
    //stream.on('end', function () { console.log('end') })
    //stream.on('close', function () { console.log('close') })
    //stream.on('readable', function () { console.log('readable') })
  })
}
