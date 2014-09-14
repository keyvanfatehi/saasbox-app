/** @jsx React.DOM */
module.exports = function(React) {
  var EmailForm = React.createClass({
    setupEmailAddress: function() {
      var self = this;
      // set the behavior
      this.emailFormNext = function(e) {
        self.setState({ submitDisabled: true })
        var email = $(e.target).find('input[type=email]').val()
        self.props.controller.requestEmailVerificationToken(email, function() {
          self.emailFormNext = function(e) {
            var token = $(e.target).find('input#verify_email').val()
            self.props.controller.checkEmailVerificationToken(token, function(valid) {
              if (valid) {
                self.setState({ emailFormActive: false, emailFormVerify: false })
              } else {
                alert('Invalid verification code')
              }
            })
          }
          self.setState({ submitDisabled: false })
          self.setState({ emailFormActive: true, emailFormVerify: true })
          setTimeout(function() { $('input#verify_email').focus() }, 0);
        })
      }
      // show the form
      this.setState({ emailFormActive: true, emailFormVerify: false })
      setTimeout(function() { $('input[type=email]').focus() }, 0);
    },
    cancelEmailForm: function(e) {
      e.preventDefault();
      this.setState({ emailFormActive: false, emailFormVerify: false })
    },
    getInitialState: function() {
      return { emailFormActive: false, emailFormVerify: false }
    },
    render: function() {
      var emailLinkStyle = this.state.emailFormActive ? { display: 'none' } : {}
      var emailFormStyle = this.state.emailFormActive ? {} : { display: 'none' } 
      var verifyingEmail = this.state.emailFormActive && this.state.emailFormVerify
      var emailVerifyStyle = verifyingEmail ? {} : { display: 'none' }
      return (
        <div>
          <a href="#" style={emailLinkStyle} onClick={this.setupEmailAddress}>
            {this.props.email ? 'Update' : 'Setup'} Email Address
          </a>
          <form style={emailFormStyle} onSubmit={this.emailFormNext}>
            <span>
              <label>Enter Email Address: </label>
              <input type="email" required disabled={this.state.emailFormVerify}/>
            </span>
            <br />
            <span style={emailVerifyStyle}>
              <label>Enter Confirmation Code: </label>
              <input type="text" id="verify_email" />
            </span>
            <input type="submit" disabled={this.state.submitDisabled} />
            <button onClick={this.cancelEmailForm}>Cancel</button>
          </form>
        </div>
      )
    }
  })
  return EmailForm;
}
