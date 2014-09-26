var Jobs = require('./controllers/jobs_controller')

module.exports = window

window.startAdminDashboard = function() {
  var jobs = new Jobs();
  var el = $('#jobs').get(0);
  jobs.mountInterface(el);
}
