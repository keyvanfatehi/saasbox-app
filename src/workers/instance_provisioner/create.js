var Account = require('../../server/models').Account
  , Agent = require('../../server/agent')
  , logger = require('../../logger')

module.exports = function() {
  logger.info('Received message from agent creator: ', msg.data);
  Account.findOne({ _id: msg.data.owner }, function(err, user) {
    if (err) return done(err);
    else if (!user) return done(new Error('could not find user'));
    else {
      var slug = msg.data.slug;
      var instances = user.instances;
      var instance = user.instances[slug];
      if (msg.data.status === 'got ip') {
        instance.agent.ip = msg.data.ip
        instance.agent.provisioning = false;
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
}
