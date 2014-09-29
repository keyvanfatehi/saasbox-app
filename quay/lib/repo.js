var spawn = require('child_process').spawn;

var buildAndPush = function (sourcePath, tag, remoteTag, done) {
  spawn('docker', ['build', '-t', tag, '.'], {
    stdio: 'inherit',
    cwd: sourcePath,
  }).on('close', function (code) {
    if (code === 0) {
      tagForPush(tag, remoteTag, done)
    } else {
      done(new Error('Build exited with non-zero code '+code))
    }
  })
}

var tagForPush = function (localTag, remoteTag, done) {
  spawn('docker', [ 'tag', localTag, remoteTag ], {
    stdio: 'inherit'
  }).on('close', function (code) {
    if (code === 0) {
      push(remoteTag, done)
    } else {
      done(new Error('Tag exited with non-zero code '+code))
    }
  })
}

var push = function (tag, done) {
  spawn('docker', [ 'push', tag ], {
    stdio: 'inherit'
  }).on('close', function (code) {
    if (code === 0) {
      done(null)
    } else {
      done(new Error('Push exited with non-zero code '+code))
    }
  })
}

module.exports = {
  buildAndPush: buildAndPush
}
