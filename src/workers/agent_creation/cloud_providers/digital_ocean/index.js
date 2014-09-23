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
var getFingerprint = require('ssh-fingerprint')
var Promise = require('bluebird')

module.exports = function(clientConfig) {
  var client = require('./client')(clientConfig)

  return {
    createServer: function(job, progress, ssh_public_key, done) {
      var instance = job.instance
      var fingerprint = getFingerprint(ssh_public_key)
      client.keys().then(function(keys) {
        return new Promise(function(resolve,reject){
          var ssh_key = _.find(keys, {fingerprint: fingerprint})
          // are our fingerprints there? if not, add them
          if (! ssh_key) {
            //throw new Error('no key!ass'+ ssh_public_key)
            // need to add it 
            client.addKey({
              name: 'saasbox-app-'+(process.env.NODE_ENV || 'dev'),
              public_key: ssh_public_key
            }).then(resolve).catch(reject).error(reject)
          } else {
            resolve()
          }  
        })
        
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
      }).then(client.createDroplet).then(function(res) {
        var id = res.droplet.id
        job.progress({
          progress: 6,
          droplet_id: id
        })
        //cb(null, {
        //  ip: "127.0.0.1"
        //})
      }).catch(done).error(done)
    }
  }
}
