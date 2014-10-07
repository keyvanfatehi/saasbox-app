module.exports = function(json) {
  console.log('setting notes', json.app)
  this.notes = {
    url: 'https://'+this.fqdn,
    admin: {
      login: json.app.login || json.app.email,
      password: json.app.password
    }
  }
}
