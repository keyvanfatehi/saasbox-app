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
  - subscription plan
    - pay for what you use
    - billed monthly
  - metering
    - plan enforcement
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
   -  user-namespaced subdomains

## end to end testing & development

Execute `npm run e2e` to begin

If you're trying to run the tests, use NODE_ENV=test

If you're trying to hack, just leave off NODE_ENV
