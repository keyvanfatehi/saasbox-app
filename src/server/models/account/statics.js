module.exports = {
  verifyEmailByToken: function(token, cb) {
    console.log(token);
    cb(new Error('sfs'))
    return;
    this.findOne({
      unverifiedEmailToken: token

    })
  }
}
