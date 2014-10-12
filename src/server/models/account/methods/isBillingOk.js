/*
 * This function can be used in frequent sweeps to determine
 * if attention is needed on any account, such as:
 *    - credit cards expiring
 *    - account credit depleting to 0 w/o a credit card to take over
 * any other billing related issues
 */
module.exports = function (opts) {
  var opts = opts || {}
  if (opts.cents && this.hasEnoughCashOnHand(opts.cents)) return true;
  if (! this.stripeCustomerId) return false;
  if (! this.creditCardInfo) return false;
  return true;
}
