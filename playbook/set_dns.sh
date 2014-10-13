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
setRecord A db.upstreamapp.com 104.131.100.139

# Workers
setRecord A wrk01.upstreamapp.com 104.131.87.137

# Web
setRecord A www.upstreamapp.com 104.131.100.128
setRecord A upstreamapp.com 104.131.100.128
