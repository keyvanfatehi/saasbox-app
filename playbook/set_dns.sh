#!/bin/sh
# Mailinabox DNS Control
BOX="box.pillbox.io"
USERNAME="postmaster@pillbox.io"
PASSWORD="RgcvD4KYW2DgQgbL"

function setRecord() {
  echo "$1 $2 => $3"
  curl -d "" --user $USERNAME:$PASSWORD "https://$BOX/admin/dns/set/$2/$1/$3"
}

# Database nodes
setRecord A db.pillbox.io 104.131.100.139

# Worker nodes
setRecord A wrk01.pillbox.io 104.131.87.137
setRecord A wrk02.pillbox.io 104.131.87.136

# Web app nodes
setRecord A web01.pillbox.io 104.131.100.128

# Web app entrypoint (load balancer)
setRecord A app.pillbox.io 104.131.100.128
