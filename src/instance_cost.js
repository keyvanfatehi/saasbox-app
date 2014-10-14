var dollar = require('./cent_to_dollar')
var hoursInMonth = 672;

module.exports = function(centsPerMonth) {
  var centsPerHour = centsPerMonth / hoursInMonth
  return {
    monthly: {
      cents: centsPerMonth,
      dollars: dollar(centsPerMonth)
    },
    hourly: {
      cents: centsPerHour,
      dollars: dollar(centsPerHour)
    }
  }
}

