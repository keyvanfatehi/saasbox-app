var Promise = require('bluebird')
var _ = require('lodash')
var backoff = require('backoff')

module.exports = function(instance, client) {
  return function(new_droplet_payload) {
    return new Promise(function(resolve, reject){

      var waitForNetwork = function(droplet) {
        return new Promise(function(resolve, reject) {

          var fibonacciBackoff = backoff.fibonacci({
            randomisationFactor: 0,
            initialDelay: 1000,
            maxDelay: 120000
          });

          var check = function(number, delay, fail) {
            console.log('checking network', number + ' ' + delay + 'ms');
            client.fetchDroplet(droplet.id).then(function(droplet) {
              try {
                var ip = _.find(droplet.networks.v4, { type: 'public' }).ip_address
                if (ip) {
                  console.log("found ip!", ip)
                  fibonacciBackoff.reset()
                  resolve(droplet);
                } else { fail() }
              } catch (e) { fail() }
            })
          }

          fibonacciBackoff.on('backoff', function(number, delay) {
            // Do something when backoff starts, e.g. show to the
            // user the delay before next reconnection attempt.
            console.log(number + ' ' + delay + 'ms');
          });

          fibonacciBackoff.on('ready', function(number, delay) {
            // Do something when backoff ends, e.g. retry a failed
            // operation (DNS lookup, API call, etc.). If it fails
            // again then backoff, otherwise reset the backoff
            // instance.
            check(number, delay, fibonacciBackoff.backoff)
          });

          fibonacciBackoff.backoff();

        })
      }

      var promise = null;
      var droplet = instance.agent.vps
      if (droplet) {
        console.log("vps exists")
        promise = client.fetchDroplet(droplet.id)
      } else {
        console.log("no vps exists, creating it")
        promise = client.createDroplet(new_droplet_payload)
      }
      promise
      .then(promiseUpdateAgentVps(instance))
      .then(waitForNetwork)
      .then(promiseUpdateAgentVps(instance))
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
