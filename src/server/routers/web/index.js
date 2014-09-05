var router = require('express').Router()
  , product = require('../../../../product')

router.get('/', function(req, res, next) {
  res.render('index.haml', { title: "Hosted "+product.title })
})

module.exports = router
