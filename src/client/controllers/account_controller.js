/** @jsx React.DOM */
var AccountControl = require('../components/account_control')(React)

function Account() {
  this.resourcePath = '/api/v1/account';
  var attributes = this.attributes = {};
  this.fetch = function(cb) {
    $.getJSON(this.resourcePath, function(data) {
      attributes = data;
      cb(data);
    });
  }
  this.delete = function() {
    var confirmed = (
      confirm('Do you really want to DELETE your account? All apps and data will be destroyed.') &&
      confirm('Are you absolutely sure that you want to irreversibly DELETE your account, apps, and data?')
    )
    if (!confirmed) return;
    $.ajax({
      type: 'DELETE', 
      url: this.resourcePath,
      data: JSON.stringify({ confirm: true }),
      contentType: 'application/json',
      dataType: 'json',
      success: function(data) {
        if (data.deleted)
          window.location = '/'
      }
    })
  }
  this.requestEmailVerificationToken = function(email, cb) {
    $.ajax({
      type: 'PUT', 
      url: this.resourcePath+'/email',
      data: JSON.stringify({ email: email }),
      contentType: 'application/json',
      dataType: 'json',
      success: cb
    })
  },
  this.checkEmailVerificationToken = function(token, cb) {
    $.ajax({
      type: 'PUT', 
      url: this.resourcePath+'/email',
      data: JSON.stringify({ token: token }),
      contentType: 'application/json',
      dataType: 'json',
      success: function(data) {
        cb(data.valid)
      }
    })
  },
  this.mountInterface = function(el) {
    var $el = $(el).get(0);
    var jsx = <AccountControl controller={this} />
    React.renderComponent(jsx, $el);
  }
}

module.exports = Account;
