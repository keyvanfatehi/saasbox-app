var logger = require('../../../../logger')

module.exports = function(agent, callback) {
  return agent.perform('install', this.slug, {
    namespace: this.name,
    fqdn: this.fqdn,
    config: this.config
  }, function(err, response) {
    var body = response.body;
    if (err)
      return callback(err);
    if (!body.app.url)
      return callback(new Error('URL is undefined. Install failed'))
    logger.info('creating proxy from '+this.fqdn+' to '+body.app.url)
    agent.createProxy(this.fqdn, body.app.url, callback)
  }.bind(this))
}
