util = require 'util'
Mailhide = require '../'

mailhider = new Mailhide {
  privateKey: "9aa749cd1f9eece41df3e18010b922dd"
  publicKeyFile: "#{__dirname}/example.public.key"
}

hide = (email) ->
  url = mailhider.url email
  
  util.puts "Open this URL in your browser:\n"
  util.puts "#{url}\n"
  util.puts "Make sure it decodes to '#{email}'.\n"

# Testing re-use
hide 'johndoe@example.com'
hide 'alice@examle.com'
