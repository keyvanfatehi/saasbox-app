var router = require('express').Router()
require('./account')(router)
require('./account/email')(router)
require('./instances')(router);
require('./jobs')(router);
module.exports = router
