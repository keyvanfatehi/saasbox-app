module.exports = function(json) {
  this.notes = {
    url: 'https://'+this.fqdn,
    admin: {
      login: json.app.login || json.app.email,
      password: json.app.password
    }
  }
}
