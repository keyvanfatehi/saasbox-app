var stripeSecretKey = require('../../../../etc/stripe.secret')
var stripe = require("stripe")(stripeSecretKey)

var chargeCustomer = function (customerId, cents) {
  stripe.charges.create({
    amount: cents,
    currency: "usd",
    customer: customerId
  });
}

var updateOrCreateCustomer = function (token, user) {
  var params = {
    card: token.id,
    description: user.email
  }
  var id = user.stripeCustomerId
  if (id) {
    return stripe.customers.update(id, params);
  } else {
    return stripe.customers.create(params);
  }
}

module.exports = {
  // get customer id, charge, refund, persist credit card info and customer id
  updateBillingInfo: function (data, user, callback) {
    updateOrCreateCustomer(data.token, user).then(function(customer) {
      user.creditCardInfo = data.token.card;
      user.stripeCustomerId = customer.id;
      return stripe.charges.create({
        amount: 123, // amount in cents, again
        currency: "usd",
        customer: customer.id
      });
    }).then(function(charge) {
      return stripe.charges.refund(charge.id)
    }).then(function (refund) {
      user.putInGoodStanding()
      user.save(function (err) {
        if (err) callback(err);
        callback(null);
      });
    }).catch(function (err) {
      if (err) callback(err);
    });
  },
}
