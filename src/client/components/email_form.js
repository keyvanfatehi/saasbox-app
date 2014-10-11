/** @jsx React.DOM */
module.exports = function(React) {
  var EmailForm = React.createClass({
    setupEmailAddress: function() {
      var self = this;
      // set the behavior
      this.emailFormNext = function(e) {
        e.preventDefault();
        var email = $(e.target).find('input[type=email]').val().trim()
        if (email === self.props.email) return false;
        self.setState({ submitDisabled: true, sendingEmail: true })
        self.props.controller.requestEmailVerificationToken(email, function() {
          self.setState({ submitDisabled: true, sendingEmail: false })
          self.emailFormNext = function(e) {
            e.preventDefault();
            var token = $(e.target).find('input#verify_email').val().trim();
            if (token.length < 1) return false;
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
            {this.props.email ? 'Change' : 'Setup'} Email Address
          </a>
          <form style={emailFormStyle} onSubmit={this.emailFormNext}>
            <span>
              <label>Enter Email Address: </label>
              <input placeholder={this.props.email} type="email" required disabled={this.state.emailFormVerify}/>
              { this.state.sending ? 
                <div>Sending email ...</div>
                : ''
              }
            </span>
            <br />
            <span style={emailVerifyStyle}>
              <label>Enter Verification Code: </label>
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
