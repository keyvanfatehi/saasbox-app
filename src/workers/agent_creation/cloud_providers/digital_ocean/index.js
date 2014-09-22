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

var _ = require('lodash')
var getFingerprint = require('ssh-fingerprint');

module.exports = function(clientConfig) {
  var client = require('./client')(clientConfig)

  return {
    createServer: function(instance, ssh_public_key, done) {
      var fingerprint = getFingerprint(ssh_public_key)
      client.keys().then(function(keys) {
        // are our fingerprints there? if not, add them
        var ssh_key = _.find(keys, { fingerprint: fingerprint })
        if (! ssh_key) {
          throw new Error('no key!')
          // need to add it 
        }
      }).then(client.sizes).then(function(sizes) {
        var size = _.find(sizes, { memory: instance.size.memory })
        var region = _.find(size.regions, function(rslug) {
          if (instance.region === rslug.substring(0, 3)) return true
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
      }).then(function(options) {
        throw new Error('need to create droplet with these options '+JSON.stringify(options, null, 4))
        client.createDroplet({
          /* droplet data */
        }).then(function(droplet) {
          console.log('droplet?', droplet)
          throw new Error('bout tos end fake dadta');
          cb(null, {
            ip: "127.0.0.1"
          })
        })
      }).catch(done).error(done)
    }
  }
}
