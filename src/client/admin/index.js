var ReactBull = require('react-bull')(React)
//  , AccountAdmin = require('./controllers')(React)

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

window.startAccountAdministrator = function(selector) {
  //var viewController = new AccountAdmin();
  //viewController.mountInterface($(selector).get(0))
}
