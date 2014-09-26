var redisModel = require('./model')
var q = require('bluebird')

module.exports = function (r) {
  r.route('/jobs')
  .all(authorizeAdmin)
  .get(sendJobs)
}

var authorizeAdmin = function (req, res, next) {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401).end();
  }
}

var sendJobs = function (req, res, next) {
  //var jobs = [{
  //  id: 1,
  //  type: 'instance provider',
  //  status: 'active', 
  //  progress: 10
  //}];
  requestActive(req, res).then(function(model){
    console.log(model);
    res.json(model);
  });
}

var requestActive = function(req, res){
  var dfd = q.defer();
  redisModel.getStatus("active").done(function(active){
    redisModel.getJobsInList(active).done(function(keys){
      redisModel.formatKeys(keys).done(function(formattedKeys){
        redisModel.getProgressForKeys(formattedKeys).done(function(keyList){
          redisModel.getStatusCounts().done(function(countObject){
            var model = { keys: keyList, counts: countObject, active: true, type: "Active" };
            dfd.resolve(model);
          });
        });
      });
    });
  });
  return dfd.promise;
}
