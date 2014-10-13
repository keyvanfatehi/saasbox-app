if [[ -z $1 ]]; then
  echo "Usage: $0 <subdomain>"
  echo "  $DOC"
  exit 1
fi

FQDN=$(node -e "console.log(require('./etc/config').zone)")
USERNAME=$1
HOST=${IP_ADDRESS-$1.$FQDN}
