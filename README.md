Saasbox
================

Dead simple SaaS platform

## Deployment

See `playbook/README.md`

## Configuration

The app is designed to wrap a Docker image which is defined as Product.

Product exposes all attributes and specifications pertaining to the product.

## Features
  - subscription plan
    - pay for what you use
    - billed monthly
  - metering
    - plan enforcement
  - mailer
    - mailinabox
  - payment gateway
    - stripe
  - landing page
  - onboarding
    - account creation
    - plan selector
    - app configurator
    - start, destroy, etc buttons
  - ansible-based full stack deployment
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
  - mailinabox DNS orchestration
   -  user-namespaced subdomains

## Requirements

* NodeJS
* MongoDB
* Redis

## Development

Run the worker `node-dev worker.js`

Run the server `node-dev server.js`

Hack...

## Testing

### Unit

Execute `npm test` to run all the unit tests

### Integration

Execute `npm run e2e` to begin

If you're trying to run the tests, use NODE_ENV=test

If you're trying to hack, just leave off NODE_ENV

## Adding Products

See `products/`

Products require Docker images.

The images are hosted on Quay.io. See `quay/`
