var Agent = require('../../server/agent')
  , logger = require('../../logger')
  , Promise = require('bluebird')

module.exports = function(mode) {
  /* mode === 'soft'
  * we can use this to change it to a hard destroy
  * e.g. delete volumes, links, scope etc.
  * a soft destroy doesnt delete anything but the container itself
  * */
  return function(instance) {
    return new Promise(function(resolve, reject) {
      var agent = new Agent(instance.agent);
      agent.perform('destroy', instance.slug, {
        namespace: instance.name
      }, function(err, response) {
        if (err) {
          logger.error(err.message) 
          reject(err);
        } else resolve(instance)
      })
    })
  }
}
