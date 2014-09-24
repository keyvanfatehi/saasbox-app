var logger = require('../src/logger')
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
logger.info('env: '+process.env.NODE_ENV)
module.exports = process.env.NODE_ENV
