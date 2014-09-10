#!/bin/bash

pgrep -f selenium-server-standalone java > /dev/null
if [[ "$?" != "0" ]]; then
  echo "Selenium server must be running"
  exit 1
fi

pgrep mongod > /dev/null
if [[ "$?" != "0" ]]; then
  echo "MongoDB must be running"
  exit 1
fi

nc -z localhost 5010 > /dev/null
if [[ "$?" != "0" ]]; then

if [[ -z $DOCKER_HOST ]]; then
cat <<EOF | cat
DOCKER_HOST must be set
A fake docker is available, start it with:
  node test/fake_docker.js
  export DOCKER_HOST=tcp://localhost:5123
EOF
exit 1
fi

AGENT_SERVER='../saasbox-agent/server.js'
if [[ ! -f "$AGENT_SERVER" ]]; then
  echo "../saasbox-agent/server.js not found"
fi
cat <<EOF | cat
Start the agent

  DOCKER_HOST=$DOCKER_HOST \\
  CONTROL_PORT=5010 \\
  API_SECRET=secret \\
  NODE_ENV=test \\
  node-dev $AGENT_SERVER
EOF
exit 1
fi

nc -z localhost 5009 > /dev/null
if [[ "$?" != "0" ]]; then
cat <<EOF | cat
Start the app

  PORT=5009 \\
  NODE_ENV=test \\
  node-dev server.js
EOF
exit 1
fi

echo "Starting nightwatch..."
node_modules/.bin/nightwatch
