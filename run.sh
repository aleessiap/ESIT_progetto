#!/usr/bin/env sh

echo mongodb://localhost:27017/ESIT > server_conf.txt
curl http://169.254.169.254/latest/meta-data/public-ipv4 >> server_conf.txt

node server\index.js
