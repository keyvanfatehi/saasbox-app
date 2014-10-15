var _ = require('lodash')
  
// TODO
module.exports = function(req, res, next) {
  if (req.body.confirm) {
    //req.logout();
    // destroy all instances
    if (req.user.instances) {
      _.each(req.user.instances, function(e) {
        console.log(e);
      })
    }
    res.json({ deleted: true })
  } else {
    res.status(304).json({ deleted: false });
  }
}
