#!/bin/bash
if [[ -z $NODE_ENV ]]; then
  NODE_ENV=development
  NODE_BIN=node-dev
else
  NODE_ENV=test
  NODE_BIN=node
fi

nc -z localhost 4444 > /dev/null
if [[ "$?" != "0" ]]; then
  echo "Selenium server must be listening on 4444"
  exit
fi

nc -z localhost 27017 > /dev/null
if [[ "$?" != "0" ]]; then
  echo "MongoDB must be listening on 27017"
  exit
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
exit
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
  NODE_ENV=$NODE_ENV \\
  $NODE_BIN $AGENT_SERVER
EOF
exit
fi

nc -z localhost 5009 > /dev/null
if [[ "$?" != "0" ]]; then
cat <<EOF | cat
Start the app

  PORT=5009 \\
  NODE_ENV=$NODE_ENV \\
  $NODE_BIN server.js
EOF
exit
fi

node_modules/.bin/nightwatch
