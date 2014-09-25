var logger = require('../../logger')
  , Instance = require('../../server/models').Instance
  , promiseDNS = require('./promise_dns')
  , Promise = require('bluebird')
  , io = require('../../server/socketio')
  , promiseVPS = require('./promise_vps')
  , config = require('../../../etc/config')
  , simpleStacktrace = require('../../simple_stacktrace')
  , cloudProviders = require('./cloud_providers')
  , blockUntilListening = require('./block_until_listening')

/* spin up new vm on digitalocean with the correct public key
 * get vm ip
 * create dns entry
 * provision with ansible
 * callback each step to web app, storing agent secret, etc
 * push each step to UI over websocket
 */

module.exports = function(queue) {
  queue.process(function(job, done){
    var progress = null;
    logger.info('received agent creation job', job.data);

    var cloudProvider = job.data.cloudProvider
    var apiConfig = config.cloud_providers[cloudProvider]
    var api = cloudProviders[cloudProvider](apiConfig)
    var ip_addr = null;

    Instance.findByIdAndPopulateAccount(job.data.instance).then(function(instance) {
      job.instance = instance
      job.progress({ progress: 1 })
      return instance
    })
    .then(promiseVPS(api, config.ssh_public_key))
    .then(function(_ipv4_addr) {
      ip_addr = _ipv4_addr;
      job.progress({ progress: 10 })
      logger.info('vps ip:', ip_addr);
    }).then(function() {
      promiseDNS({
        name: job.instance.agent.fqdn,
        target: ip_addr
      }).error(function(err) {
        logger.warn('DNS Error: '+err.message)
      })
      promiseDNS({
        name: job.instance.fqdn,
        target: ip_addr
      }).error(function(err) {
        logger.warn('DNS Error: '+err.message)
      })
    })
    .then(function() {
      logger.info("created dns records")
      job.progress({ progress: 20 })
      return blockUntilListening({
        port: 22,
        ip: ip_addr,
        pattern: /SSH/,
        timeout: 2000
      })
    })
    .then(function() {
      job.progress({ progress: 20 })
      logger.info('SSH connections are now possible')
      // when done, set agent.provisioned to new Date();
      // now kick off ansible, start sending me status updates about it
    })
    .catch(done)
    .error(done) // todo destroy the VPS in case of errors
  })
  
  queue.on('progress', function(job, newState){
    newState.status = 'provisioning'
    if (job.instance) {
      job.instance.updateProvisioningState(newState, function(err) {
        if (err) logger.error(err);
        else {
          var room = job.instance.slug+'-'+job.instance.account.username
          io.to(room).emit(job.instance.slug+'ProvisioningStateChange', {
            state: newState
          })
        }
      })
    } else {
      logger.error('could not update state of job due to missing instance', job.data, newState)
    }
  })
  
  queue.on('failed', function(job, err){
    logger.error('job failed due to error '+err.message, job.data)
    job.progress({
      failed: true,
      error: {
        message: err.message,
        stack: (
          process.env.NODE_ENV === 'production' ?
          simpleStacktrace(err.stack) : err.stack
        )
      }
    })
  })
}
