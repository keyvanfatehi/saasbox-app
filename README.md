Saasbox
================

A web app that facilitates Docker images to be spun up as isolated downstream SaaS products with their own web presence, subscriptions, and control panel. 

It's powered by ydm

## Configuration

The app is designed to wrap a Docker image which is defined as Product.

Product exposes all attributes and specifications pertaining to the product.

This version of saasbox focuses on providing Strider, however the design is general

When a user creates a new account, a subdomain is registered with Cloudflare APP_FQDN and points at YDM_HOST

## Features
  - [x] authentication
  - subscription plan
    - pay as you go, hourly
    - 72 hours of free credit each month
    - [0.05 cents per hour](http://www.wolframalpha.com/input/?i=%28hours+in+a+month%29+*+%240.05)
    - unlimited support, backups, and automated scaling
  - metering
    - plan enforcement
    - pay as you go logic
  - mailier
    - mailgun
  - payment gateway
    - stripe
  - landing page
  - onboarding
    - account creation
    - plan selector
    - app configurator
    - start button
  - control panel
    - docker orchestration
      - reconfigure app
      - view app logs
    - view metering data & quotas
      - cpu
      - ram
      - hdd
    - change plan / upgrade
      - increase docker limits
  - cloudflare DNS orchestration
   - user-namespaced subdomains

## end to end tests

```
# Start selenium

# Start mongo

# Start Docker or fake it with test/fake_docker.js

# Start saasbox-agent, pointing it at Docker
DOCKER_HOST=tcp://192.168.59.103:2375 \
CONTROL_PORT=5010 \
API_SECRET=secret \
NODE_ENV=test \
node-dev ../saasbox-agent/server.js

# Start saasbox-app
PORT=5009 NODE_ENV=test node-dev server.js

# Run the end to end tests
npm run e2e
```
