function stripModules(trace) {
  newTrace = [];
  for (var i = 0, l = trace.length; i < l; i ++) {
    var line = trace[i];
    if (! line.match('node_modules/')) {
      newTrace.push(line);
    }
  }
  return newTrace
}

function onlyWithinParens(trace) {
  newTrace = [];
  for (var i = 0, l = trace.length; i < l; i ++) {
    var line = trace[i];
    var match = line.match(/\((.+)\)/)
    if (match) {
      newTrace.push(match[1]);
    }
  }
  return newTrace
}

var path = require('path')
var root = path.join(__dirname, '..')

module.exports = function (stack) {
  var trace = stack.split('\n')
  trace = stripModules(trace)
  trace = onlyWithinParens(trace)
  trace = trace.join('\n')
  trace = trace.replace(RegExp(root, 'g'), '');
  return trace;
}
