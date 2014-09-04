module.exports = function (r) {
  r.route('/instance')
  .get(function (req, res, next) {
    //res.status(200).json({ status: 'off' })
    res.status(404).end()
  });
}
