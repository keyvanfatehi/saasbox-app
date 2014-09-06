var config = require('../../etc/config')
  , session = require('express-session')
  , MongoStore = require('connect-mongo')(session);

module.exports = function(conn) {
  return session({
    store: new MongoStore({ mongoose_connection: conn }),
    secret: config.cookie_secret
  });
}
