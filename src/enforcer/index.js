var logger = require('../logger')
  , CronJob = require('cron').CronJob;

module.exports = {
  activate: function(key, context) {
    var interval = require('./'+key)(context);
    var job = new CronJob({
      cronTime: interval.cronTime,
      onTick: interval.onTick,
      start: true,
      timeZone: "America/Los_Angeles"
    });
    logger.info(key+' enforcement running '+interval.humanTime, {
      enforcement: key,
      cronTime: interval.cronTime,
    })
  }
}
