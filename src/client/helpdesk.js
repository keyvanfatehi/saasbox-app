var Helpdesk = function() {}

Helpdesk.prototype = {
  foo: function() {
    console.log('atest')
  },
  trigger: function() {
    this.foo()
  }
}

module.exports = Helpdesk;
