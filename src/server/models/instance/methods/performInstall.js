var logger = require('../../../../logger')

module.exports = function(agent, callback) {
  return agent.perform('install', this.slug, {
    namespace: this.name,
    fqdn: this.fqdn,
    config: this.config
  }, function(err, response) {
    if (err) return callback(err);
    var body = response.body;
    if (body && body.app) {
      this.setInstallNotes(body);
      logger.info('creating proxy from '+this.fqdn+' to '+body.app.url)
      agent.createProxy(this.fqdn, body.app.url, function(err) {
        if (err) return callback(err);
        this.save(callback);
      }.bind(this))
    } else return callback(null)
  }.bind(this))
}
