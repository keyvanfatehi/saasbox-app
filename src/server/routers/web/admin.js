module.exports = function(router) {
  router.get('/admin', function(req, res) {
    res.render('admin/dashboard');
  });
}
