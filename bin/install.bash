#!/usr/bin/env bash

if [[ -z $1 ]]
then
    do

      if [[$1 == *.zip]]
      then
          do

            if [ -f $file_path ];
            then
                do

                  let certs_file_path = $1

            else
                do

                  echo "Syntax error!\nPassed file does not exists.\n Usage: ./install.bash <certs_zip_file_path>"
                  exit 1

      else
          do

            echo "Syntax error!\nPassed file must be .zip a file.\n Usage: ./install.bash <certs_zip_file_path>"
            exit 1

else
   do

     echo "Syntax error!\nYou must pass a file .zip containing aws certificates.\n Usage: ./install.bash <certs_zip_file_path>"
     exit 1
fi


echo "
----------------------
  NODE & NPM
----------------------
"

sudo apt-get update
sudo apt-get install build-essential libssl-dev
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | sh
source ~/.profile
nvm install 14.17.6


echo "
----------------------
  MONGODB
----------------------
"

# import mongodb 5.0 gpg key + repo

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update

# install the latest version of mongodb
sudo apt-get install -y mongodb-org

# start mongodb
sudo systemctl start mongod
sudo systemctl enable mongod


echo "
----------------------
  PM2
----------------------
"

# install pm2 with npm
sudo npm install -g pm2

# set pm2 to start automatically on system startup
sudo pm2 startup systemd


echo "
----------------------
  NGINX
----------------------
"

# install nginx
sudo apt-get install -y nginx


echo "
----------------------
  UFW (FIREWALL)
----------------------
"

# allow ssh connections through firewall
sudo ufw allow OpenSSH

# allow http & https through firewall
sudo ufw allow 'Nginx Full'

# enable firewall
sudo ufw --force enable


echo "
----------------------
  APP CONFIG
----------------------
"

(cd .. && sudo chmod 755 ./*/*/*)
sudo npm install

(cd .. && sudo unzip ../dist.zip)
(cd ../server && sudo unzip ${certs_path})

sudo cp "./webapp.sh" /usr/local/bin

echo "export WEBAPP_DIR=`pwd`/..">~/.profile
source ~/.profile

echo "server {
  charset utf-8;
  listen 80 default_server;
  server_name _;

  # angular app & front-end files
  location / {
    root ${WEBAPP_DIR}/dist/angular8project;
    try_files $uri /index.html;
  }

  # node api reverse proxy
  location /api {
    proxy_pass http://localhost:8080;
  }
}">/etc/nginx/available-sites/default
sudo systemctl restart nginx

exit 0
