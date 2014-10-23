module.exports = function(req, res, next) {
  if (req.body.confirm) {
    req.user.destroyAllInstances().
      then(req.user.removeAsync).
      then(function() {
      req.logout();
      res.json({ deleted: true });
    }).error(next).catch(next)
  } else {
    res.status(304).json({ deleted: false });
  }
}
