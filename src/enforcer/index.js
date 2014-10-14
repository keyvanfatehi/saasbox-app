var logger = require('../logger')
  , CronJob = require('cron').CronJob;

module.exports = {
  activate: function(key, context) {
    context.logger = context.logger || logger;
    context.errback = function(err) {
      context.logger.error('enforcer had an error', {
        enforcer: 'daily', stack: err.stack
      })
      cb = context.errback || function(){};
    }
    var interval = require('./'+key)(context);
    var job = new CronJob({
      cronTime: interval.cronTime,
      onTick: function() {
        cb = context.callback || function(){};
        interval.onTick(cb)
      },
      start: true,
      timeZone: "America/Los_Angeles"
    });
    logger.info(key+' enforcer running '+interval.humanTime, {
      enforcer: key
    })
  }
}
