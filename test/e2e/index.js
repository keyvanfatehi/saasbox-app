process.NODE_ENV = 'test'
var config = require('../etc/config')

module.exports = {
  setUp : function(browser) {
    browser
    .url('http://localhost:'+config.port)
    .assert.title("Hosted Strider")
  },
  
  tearDown : function() {
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
