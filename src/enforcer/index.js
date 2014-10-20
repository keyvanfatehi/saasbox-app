var logger = require('../logger')
  , models = require('../server/models')
  , CronJob = require('cron').CronJob;

module.exports = {
  activate: function(key) {
    var interval = require('./'+key);
    var job = new CronJob({
      cronTime: interval.cronTime,
      onTick: function() {
        interval.onTick(function(err) {
          if (err) {
            logger.error('enforcer errored', {
              enforcer: key,
              stack: err.stack
            })
          } else {
            logger.info('enforcer finished', {
              enforcer: key
            })
          }
        })
      },
      start: true,
      timeZone: "America/Los_Angeles"
    });
    logger.info(key+' enforcer running '+interval.humanTime, {
      enforcer: key
    })
  }
}
