#!/bin/sh
# Mailinabox DNS Control
BOX="box.pillbox.io"
USERNAME="postmaster@pillbox.io"
PASSWORD="RgcvD4KYW2DgQgbL"

function setRecord() {
  echo "$1 => $2"
  curl -d "" --user $USERNAME:$PASSWORD https://$BOX/admin/dns/set/$1/a/$2
}

setRecord db.pillbox.io 104.131.100.139
setRecord web01.pillbox.io 104.131.100.128
