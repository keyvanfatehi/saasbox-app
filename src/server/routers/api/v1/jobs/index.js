var authorizeAdmin = require('../../../../middleware/authorizeAdmin')
  , redisModel = require('./redis_model')
  , redis = require('../../../../../redis')
  , getJobs = require('./get_jobs')(redisModel)
  , router = require('express').Router()

module.exports = function (r) {
  r.use('/jobs', router)
}

router.use(authorizeAdmin);

redisModel.setClient(redis.client)

var states = [ 'active', 'wait', 'failed', 'complete' ]

states.forEach(function(state) {
  router.route('/'+state)
  .get(function (req, res, next) {
    getJobs(state).then(function(data){
      res.json(data);
    }).error(next).catch(next)
  })
})

router.route('/pending/id/:type/:id')
.get(function (req, res, next) {
  var id = req.params.id
    , type = req.params.type
  redisModel.makePendingById(type, id).then(function(results){
    res.json(results);
  }).error(next).catch(next)
});


router.route('/delete/id/:type/:id')
.get(function (req, res, next) {
  var id = req.params.id
    , type = req.params.type
  redisModel.deleteJobById(type, id).then(function(results){
    res.json(results);
  }).error(next).catch(next)
});
