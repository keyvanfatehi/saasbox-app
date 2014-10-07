var logger = require('../../logger')
  , promiseRemoveVPS = require('./promise_remove_vps')
  , promiseRemoveDNS = require('./promise_remove_dns')
  , Promise = require('bluebird')

module.exports = function(queue) {
  queue.process(function(job, done) {
    logger.info('received vps remover job', job.data);

    promiseRemoveVPS(job.data.cloudProvider, job.data.vps)
    .then(Promise.map(job.data.dnsRecords, promiseRemoveDNS))
    .then(done).catch(done).error(done)
  })

  queue.on('failed', function(job, err){
    logger.warn('vps remover job failed', job.data)
    logger.error(err.stack)
  })
}
