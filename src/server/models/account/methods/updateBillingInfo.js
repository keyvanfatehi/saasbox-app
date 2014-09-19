var Billing = require('../../../billing')

module.exports = function (data, callback) {
  var provider = Billing[data.provider];
  if (provider) {
    provider.updateBillingInfo(data, this, callback);
  } else {
    callback(new Error('Unsupported billing provider '+data.provider));
  }
}
