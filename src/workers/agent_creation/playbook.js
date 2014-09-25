var logger = require('../../logger')
  , path = require('path')

module.exports = {
  promiseAgent: function(agent) {
    var playbookRoot = path.join(__dirname, '..', '..', '..', 'playbook', 'site')
    var playbookName = path.join(playbookRoot, 'site.yml')
    console.log('playbook path', playbookPath)
    //var playbook = new Ansible.Playbook().playbook(playbookPath)
    //playbook.exec()
    console.log(agent)
  }
}
