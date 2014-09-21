var io = require('../../../socketio')

module.exports = function() {
  var self = this;
  var room = 'instance-'+self._id
  return {
    name: room,
    emit: function(name, data) {
      io.to(room).emit(name, data)
    }
  }
}
