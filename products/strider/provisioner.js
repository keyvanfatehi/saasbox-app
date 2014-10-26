var ansible = require('../../src/ansible')
var ydm = require('../../src/ydm')

module.exports = {
  provision: function(instance, ip, bumpProgress) {
    return ansible.runPlaybook({
      bumpProgress: bumpProgress,
      instance: instance,
    }).then(ydm.apply)
  }
}
