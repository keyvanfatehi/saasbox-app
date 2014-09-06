process.NODE_ENV = 'test'
var config = require('../../etc/config')
var mongoose = require('mongoose')

module.exports = {
  setUp : function(browser, done) {
    mongoose.connect(config.mongodb, function () {
      mongoose.connection.db.dropDatabase(function () {
        browser
        .url('http://localhost:5009')
        .assert.title("Hosted Strider")
        done()
      })
    })
  },

  tearDown: function (done) {
    mongoose.disconnect(done);
  },
  
  "register" : function (browser) {
    var register = 'a[href="/register"]'
    browser
    .assert.containsText(register, 'register')
    .click(register)
    .setValue("input[name=username]", "nightwatch")
    .setValue("input[name=password]", "nightwatch")
    .setValue("input[name=password_confirmation]", "nightwatch")
    .click('input[type=submit]')
    .assert.containsText('body', 'welcome back, nightwatch')
    .end()
  },
};
