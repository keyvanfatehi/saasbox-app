# Mailhide

Provides easy use of the [reCAPTCHA Mailhide][mailhide] [API][mailhideAPI].

## Install

```shell
npm install mailhide
```

## Usage

```javascript

var mailhide = require('mailhide');
var mailhider = new Mailhide({
  privateKey: "9aa749cd1f9eece41df3e18010b922dd",
  publicKeyFile: __dirname + "/example.public.key"
});

var url = mailhider.url(email);

// url == "http://www.google.com/recaptcha/mailhide/d?k=01g4QpVFLdMs52QNMKC2tuCg%3D%3D&c=51q-FveskT4H19GHK6zDcohvqqiqWoicUgGIbE6QIUE%3D"
```

Also see "examples/example.coffee".


[mailhide]: http://www.google.com/recaptcha/mailhide/
[mailhideAPI]: https://developers.google.com/recaptcha/docs/mailhideapi

