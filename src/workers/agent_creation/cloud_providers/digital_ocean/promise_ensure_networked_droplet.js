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
      .then(resolve)
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
