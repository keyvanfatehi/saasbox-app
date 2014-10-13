#!/bin/sh
# Mailinabox DNS Control
BOX="box.upstreamapp.com"
USERNAME="dnsctl@upstreamapp.com"
PASSWORD="YpGymLupKBqV3bQR9bkdEqratC"

function setRecord() {
  echo "$1 $2 => $3"
  curl -d "" --user $USERNAME:$PASSWORD "https://$BOX/admin/dns/set/$2/$1/$3"
}

# Databases
setRecord A db.upstreamapp.com 104.131.87.136

# Workers
setRecord A wrk01.upstreamapp.com 104.131.87.137

# Web
WEB_IP=104.131.100.139
setRecord A www.upstreamapp.com $WEB_IP
setRecord A upstreamapp.com $WEB_IP
