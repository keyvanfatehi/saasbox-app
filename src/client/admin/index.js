var ReactBull = require('react-bull')(React)

module.exports = window

window.startJobsInterface = function() {
  $('.jobs[data-category]').each(function(i, el) {
    var category = $(el).data('category')
    var jobs = new ReactBull.JobsController(category, {
      resourcePath: '/api/v1/jobs',
      poll: 5000
    });
    jobs.mountInterface(el);
  })
}
