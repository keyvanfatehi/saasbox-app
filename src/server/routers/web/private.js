var router = require('express').Router()
  , basicRouter = require('./basic_router')
  , adminRouter = require('./admin_router')

router.use('/', basicRouter)

router.use('/admin', adminRouter);

module.exports = router
