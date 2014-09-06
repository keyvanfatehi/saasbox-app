var router = require('express').Router()
require('./account')(router)
require('./instance')(router);
module.exports = router
