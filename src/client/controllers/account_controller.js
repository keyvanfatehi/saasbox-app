/** @jsx React.DOM */
var View = require('../components/account')(React)

function Account(fetched) {
  var UI = null;

  var resourcePath = '/api/v1/account';

  this.resourcePath = resourcePath;

  this.mountInterface = function(el) {
    var $el = $(el).get(0);
    var jsx = <View controller={this} />
    UI = this.UI = React.renderComponent(jsx, $el);
  }

  this.fetch = function(cb) {
    $.getJSON(resourcePath, function(data) {
      cb(data);
      analytics.identify(data._id, {
        username: data.username,
        email: data.email,
        balance: data.balance
      })
      analytics.track('Loaded Account Data');
    });
  }

  this.delete = function() {
    var confirmed = (
      confirm('Do you really want to DELETE your account? All apps and data will be destroyed.') &&
      confirm('Are you absolutely sure that you want to irreversibly DELETE your account, apps, and data?')
    )
    if (!confirmed) return;
    $('<form action="/delete_account" method="POST"></form>').appendTo('body').submit();
  }

  this.requestEmailVerificationToken = function(email, cb) {
    $.ajax({
      type: 'PUT', 
      url: resourcePath+'/email',
      data: JSON.stringify({ email: email }),
      contentType: 'application/json',
      dataType: 'json',
      success: cb
    })
  }

  this.checkEmailVerificationToken = function(token, cb) {
    $.ajax({
      type: 'PUT', 
      url: resourcePath+'/email',
      data: JSON.stringify({ token: token }),
      contentType: 'application/json',
      dataType: 'json',
      success: function(data) {
        cb(data.valid)
        if (data.valid) {
          UI.setState({ email: data.email });
        }
      }
    })
  }

  this.chargeAndSaveCard = function(token, amount, callback) {
    $.ajax({
      type: 'PUT', 
      url: resourcePath+'/billing_info',
      data: JSON.stringify({
        provider: 'stripe',
        token: token
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function(data) {
        callback(null)
      },
      error: function(jqXHR, textStatus) {
        callback(new Error(jqXHR.status+" "+jqXHR.responseText));
      }
    })
  }
}

module.exports = Account;
