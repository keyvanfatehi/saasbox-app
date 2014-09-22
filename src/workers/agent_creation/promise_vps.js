var Promise = require('bluebird')

module.exports = function(instance) {
  return new Promise(function(resolve, reject) {
    console.log('create vps for instance', instance._id)
    // create the VPS
    //var vmApiConfig = config.cloudProviders[job.data.cloudProvider]
    //var vmApi = cloudProviders[job.data.cloudProvider](vmApiConfig)
    //console.log(vmAPI);
    logger.warn('not done yet')
    //done(new Error('restore app to off, push to UI and show in modal'))
    throw new Error('failed to create vps')
  })
}
