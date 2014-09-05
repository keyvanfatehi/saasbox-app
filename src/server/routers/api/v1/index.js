var router = require('express').Router()
//require('./session')(router)
//require('./users')(router)
require('./instance')(router);
module.exports = router
