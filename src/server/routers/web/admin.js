module.exports = function(r) {
  r.get('/admin', function(req, res) {
    res.render('admin/dashboard');
  })
}

