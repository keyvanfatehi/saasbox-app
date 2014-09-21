var getAccountBalance = require('../account_balance')
  , async = require('async')
  , dns = require('./dns')
  , crypto = require('crypto')
  , logger = require('../logger')

/* spin up new vm on digitalocean
 * get vm ip
 * create dns entry
 * provision with ansible (NAME=foo mkagent)
 * provision with ydm
 * callback each step to web app, storing agent secret, etc
 * push each step to UI over websocket
 */

var generateSecret = function() {
  return crypto.createHash('sha256').update(Math.random().toString()).update('salt').digest('hex');
}

var Queue = require('bull');
var agentCreation = {
  jobQueue: Queue('agent_creation:jobs', 6379, '127.0.0.1'),
  msgQueue: Queue('agent_creation:message', 6379, '127.0.0.1')
}

agentCreation.msgQueue.on('completed', function(job){
  // Job completed!
})
.on('failed', function(job, err){
  logger.error('job failed', err.message);
})
.on('progress', function(job, progress){
  logger.info('progress', progress);
})

var Account = require('./models/account')
var Agent = require('./agent')
agentCreation.msgQueue.process(function(msg, done){
  console.log('Received message from agent creator: ', msg.data);
  Account.findOne({ _id: msg.data.owner }, function(err, user) {
    if (err) return done(err);
    else if (!user) return done(new Error('could not find user'));
    else {
      var slug = msg.data.slug;
      var instances = user.instances;
      var instance = user.instances[slug];
      if (msg.data.status === 'got ip') {
        instance.agent.ip = msg.data.ip
        instance.agent.ready = true;
        user.update({ instances: instances }, function(err) {
          if (err) return done(err);
          else {
            var agent = new Agent(instance.agent, msg.data.ip);
            dns.addRecord(agent.fqdn, agent.ip, function(err) {
              if (err) return done(err);
              // make sure it's been added, we need it to resolve right now

              var progress = 0;
              // do some stuff
              var interval = setInterval(function() {
                progress += 10;
                msg.progress({
                  value: progress
                })
                if (progress === 100) {
                  clearInterval(interval);
                  // ok so lets say it is resolving now and the agent is ok, we continue


                  agent.perform('install', slug, {
                    namespace: user.username,
                    fqdn: instance.fqdn
                  }, function(err, ares) {
                    return done(new Error('wait wait'))
                    if (err) return done(err);
                    instance.turnedOffAt = null;
                    instance.turnedOnAt = new Date();
                    instance.notes = {
                      admin: {
                        login: ares.body.app.login,
                        password: ares.body.app.password
                      }
                    }
                    async.parallel({
                      update: function (cb) {
                        user.update({ instances: instances }, cb);
                      },
                      proxy: function (cb) {
                        agent.createProxy(instance.fqdn, ares.body.app.url, cb)
                      },
                      dns: function (cb) {
                        dns.addRecord(fqdn, agent.ip, cb);
                      }
                    }, done);
                  })

                }
              }, 1000)


            });
          }
        });
      }
    }
  })
});

module.exports = function(user, agent, slug, size, done) {
  var instances = user.instances;
  var instance = user.instances[slug];
  if (instance.ready)
    return done(new Error('Still Provisioning'));
  var subdomain = dns.subdomain(slug, user.username)
  var agentName = subdomain+'-agent'
  instance.agent = {
    name: agentName,
    secret: generateSecret(),
    fqdn: dns.fqdn(agentName),
    ready: false
  }
  instance.size = size
  instance.fqdn = dns.fqdn(subdomain)

  user.update({ instances: instances }, function(err) {
    if (err) done(err);
    else {
      agentCreation.jobQueue.add({
        cloudProvider: 'DigitalOcean',
        instance: instance,
        slug: slug,
        owner: user._id
      });
      done();
    }
  });
}
