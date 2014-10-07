var logger = require('../../logger')
  , _ = require('lodash')
  , getFingerprint = require('ssh-fingerprint')
  , ensureKey = require('./promise_ensure_key')
  , ensureNetworkedDroplet = require('./promise_ensure_networked_droplet')

module.exports = function(client) {
  return function(instance, ssh_public_key, options, done) {
    var fingerprint = getFingerprint(ssh_public_key)
    client.keys()
    .then(ensureKey(client, ssh_public_key))
    .then(client.sizes)
    .then(function(sizes) {
      var size = _.find(sizes, { memory: instance.size.memory })
      var region = _.find(size.regions, function(rslug) {
        if (instance.region === rslug) return true
      })
    return {
      region: region,
      size: size.slug
    }
    }).then(function(data) {
      return {
        image: 'ubuntu-14-04-x64',
        name: instance.slug+'-'+instance.account.username,
        region: data.region,
        size: data.size,
        ssh_keys: [fingerprint],
        backups: false // put it on the UI, charge extra
      }
    })
    .then(ensureNetworkedDroplet(instance, client, options))
    .then(function(droplet) {
      logger.info('persisting droplet')
      var addr = _.find(droplet.networks.v4, { type: 'public' }).ip_address
      instance.agent.public_ip = null;
      instance.agent.public_ip = addr
      instance.update({ agent: instance.agent }, function(err) {
        if (err) return done(err);
        else done(null, instance)
      })
    }).catch(done).error(done)
  }
}

/*
Preferred Image:

{ id: 5141286,
    name: 'Ubuntu 14.04 x64',
    distribution: 'Ubuntu',
    slug: 'ubuntu-14-04-x64',
    public: true,
    regions:
     [ 'nyc1',
       'ams1',
       'sfo1',
       'nyc2',
       'ams2',
       'sgp1',
       'lon1',
       'nyc3',
       'ams3' ],
    created_at: '2014-07-23T17:08:52Z' },

To get the full list again, use:

  client.imageList().then(function(imageList) {
    console.log(imageList)
  })
*/
