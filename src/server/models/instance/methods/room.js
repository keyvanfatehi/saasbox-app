var io = require('../../../socketio')
  , logger = require('../../../../logger')

module.exports = function() {
  var self = this;
  var room = 'instance-'+self._id
  return {
    name: room,
    emit: function(name, data) {
      io.to(room).emit(name, data)
    },
    push: function(socket, name) {
      socket.join(room)
      logger.info(name+' pushed into room '+room)
    }
  }
}
