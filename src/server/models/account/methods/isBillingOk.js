module.exports = function () {
  // check if customer id is unset
  if (! this.stripeCustomerId) return false;
  if (! this.creditCardInfo) return false;
  // TODO check if the card is unset or expired
  // but better to do that in a daily sweep and just unset the customerId
  return true;
}
