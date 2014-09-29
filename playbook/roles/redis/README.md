## redis [![Build Status](https://travis-ci.org/Oefenweb/ansible-redis.svg?branch=master)](https://travis-ci.org/Oefenweb/ansible-redis)

Set up a redis (2.8) server in Debian-like systems.

#### Requirements

None

#### Variables

A lot (see `defaults/main.yml`)

Some commonly used:

* `redis_port` [default: `6379`]: Accept connections on the specified port
* `redis_bind` [default: `[127.0.0.1]`]: Listen for connections form the specified IP addresses
* `redis_databases` [default: `16`]: The number of databases
* `redis_saves` [default: `[{seconds: 900, changes: 1}, {seconds: 30, changes: 10}, {seconds: 60, changes: 10000}]`]: Will save the DB if both the given number of seconds and the given number of write operations against the DB occurred
* `redis_slaveof` [default: `{masterip: null, masterport: null}`]: Use slaveof to make a Redis instance a copy of another Redis server
* `redis_masterauth` [default: `null`]: Master server password
* `redis_requirepass` [default: `null`]: Require clients to issue AUTH <PASSWORD> before processing any other commands
* `redis_maxclients` [default: `null`]: Set the max number of connected clients at the same time
* `redis_maxmemory` [default: `null`]: Don't use more memory than the specified amount of bytes

## Dependencies

None

#### Example

```yaml
---
- hosts: all
  roles:
  - redis
```

#### License

BSD

#### Author Information

Mischa ter Smitten (based on work of Benno Joy)

#### Feedback, bug-reports, requests, ...

Are [welcome](https://github.com/Oefenweb/ansible-redis/issues)!
