var router = require('express').Router()
require('./account')(router)
require('./account/email')(router)
require('./instance')(router);
module.exports = router
