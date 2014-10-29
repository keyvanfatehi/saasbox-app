apt-get update
apt-get install redis-server
cat <<EOF | tee /etc/supervisor/conf.d/redis.conf
[program:redis]
...
EOF
etc
