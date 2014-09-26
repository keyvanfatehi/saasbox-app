var Jobs = require('./controllers/jobs_controller')

module.exports = window

window.startJobsInterface = function() {
  $('.jobs[data-category]').each(function(i, el) {
    var category = $(el).data('category')
    var jobs = new Jobs(category);
    jobs.mountInterface(el);
  })
}
