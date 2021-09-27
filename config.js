const fs = require('fs')
const path = require("path");

// Read "server_conf.txt lines and split them"
let confs = fs.readFileSync(path.join(__dirname, 'server_conf.txt')).toString().split("\n");

let server_conf = {

  DB: confs[0],  // First line represents mongodb uri
  HOST_IP: confs[1],  // Second line represents the host_ip (aws instance IPv4 DNS)
  PORT: confs[2],  // Third line represents the configured port (express listening port)
  BOT_TELEGRAM_API_TOKEN: confs[3], // Forth line represents Bot token
  PRIVATE_KEY_THING_PATH: confs[4], // Fifth line represents private key thing cert
  CERTIFICATE_THING_PATH: confs[5], // Sixth line represents thing cert
  AMAZON_ROOT_CA_PATH: confs[6], // Seventh line represents Amazon CA cert
  WEBAPP_THING_NAME: confs[7], // Eight line represents the web app_thing name
  AWS_MQTT_HOST: confs[8] //last line represents the aws mqtt host

}

// Debug prints
console.log('*'+server_conf.DB+'*')
console.log('*'+server_conf.HOST_IP+'*')
console.log('*'+server_conf.PORT+'*')

// Exports
module.exports = server_conf

