var Promise = require('bluebird')
var _ = require('lodash')

module.exports = function(job, updateProgress, client) {
  var progress = 10;

  var bumpProgress = function() {
    progress += 1
    updateProgress(progress)
  }

  return function(new_droplet_payload) {
    return new Promise(function(resolve, reject){

      /* Don't resolve the droplet until you have an IP address 
      var waitForNetwork = function() {
        var droplet = job.instance.agent.vps;
        console.log('waiting for network')
        promiseWhile(function() {
          var a = droplet && _.isObject(droplet.networks)
          var b = a && _.isArray(droplet.networks.v4)
          var c = a && b && droplet.networks.v4.length > 0
          console.log('network?', c)
          return c
        }, function() {
          console.log('action')
          var promise = Promise.delay(2000).
            then(client.fetchDroplet(droplet.id)).
            then(promiseUpdateAgentVps(job.instance)).
            then(function(vps) {
            console.log('refreshed vps')
            droplet = vps
          })
          return promise;
        }).
          catch(reject).
          error(reject)
      }
*/

      var waitForNetwork = function(droplet) {
        return new Promise(function(resolve, reject) {
          var interval = null;
          var check = function() {
            console.log('checking network')
            bumpProgress()
            client.fetchDroplet(droplet.id).then(function(droplet) {
              try {
                var ip = _.find(droplet.networks.v4, { type: 'public' }).ip_address
                if (ip) {
                  console.log("found ip!", ip)
                  // now we'll check for SSH connectivity.
                  clearInterval(interval);
                  resolve(droplet);
                } else { throw new Error('still waiting for network') }
              } catch (e) { console.log("No network yet...") }
            })
          }
          interval = setInterval(check, 5000);
          check()
        })
      }

      var promise = null;
      var droplet = job.instance.agent.vps
      if (droplet) {
        console.log("vps exists")
        promise = client.fetchDroplet(droplet.id)
      } else {
        console.log("no vps exists, creating it")
        promise = client.createDroplet(new_droplet_payload)
      }
      promise
      .then(promiseUpdateAgentVps(job.instance))
      .then(waitForNetwork)
      .then(promiseUpdateAgentVps(job.instance))
      .then(function(droplet) {
        console.log('droplet network: ', droplet.networks.v4)

      })
      .catch(reject)
      .error(reject)
    })
  }
}


function promiseUpdateAgentVps(instance) {
  return function (vps) {
    return new Promise(function(resolve, reject) {
      instance.agent.vps = vps
      instance.update({ agent: instance.agent }, function(err) {
        if (err) return reject(err);
        else return resolve(vps)
      })
    })
  }
}
