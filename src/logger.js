var logger = module.exports = require('winston')
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });
