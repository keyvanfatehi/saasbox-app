var Promise = require('bluebird')

module.exports = function(job, client) {
  return function(new_droplet_payload) {
    return new Promise(function(resolve, reject){
      var promise = null;
      var droplet = job.instance.agent.droplet
      if (droplet) {
        promise = client.fetchDroplet(droplet.id).then(function(droplet) {
          resolve(droplet)
        })
      } else {
        promise = client.createDroplet(new_droplet_payload).then(function(droplet) {
          job.instance.agent.droplet = droplet
          job.instance.update({ agent: job.instance.agent }, function(err) {
            if (err) return reject(err);
            return resolve(droplet)
          })
        })
      }
      promise.catch(reject).error(reject)
    })
  }
}
