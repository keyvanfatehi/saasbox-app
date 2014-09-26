var authorizeAdmin = require('../../middleware/authorizeAdmin')

module.exports = function(r) {

  r.use(authorizeAdmin);

  r.use(function(req, res, next) {
    var _render = res.render.bind(res)
    res.render = function(tmpl) {
      _render('admin/'+tmpl, { layout: 'layouts/admin' });
    }
    next()
  })


  r.get('/admin', function(req, res) {
    res.render('dashboard');
  })

  r.get('/admin/jobs', function(req, res) {
    res.render('jobs')
  })
}
