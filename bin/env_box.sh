if [[ -z $2 ]]; then
  echo "Usage: $0 <user> <app>"
  echo "  $DOC"
  exit 1
fi

FQDN=$(node -e "console.log(require('./etc/config').zone)")
USERNAME=$1
APPNAME=$2
HOST=$2-$1.$FQDN
IDENTITY=etc/ssh/id_rsa 
