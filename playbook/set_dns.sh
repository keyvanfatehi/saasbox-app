#!/bin/sh
# Mailinabox DNS Control
BOX="box.pillbox.io"
USERNAME="postmaster@pillbox.io"
PASSWORD="RgcvD4KYW2DgQgbL"

function setRecord() {
  echo "$1 $2 => $3"
  curl -d "" --user $USERNAME:$PASSWORD "https://$BOX/admin/dns/set/$2/$1/$3"
}

# Database
setRecord A db.pillbox.io 104.131.100.139

# Web app
setRecord A web01.pillbox.io 104.131.100.128

setRecord A app.pillbox.io 104.131.100.128 # can later replace with a load balancer
