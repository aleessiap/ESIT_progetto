const fs = require('fs')
const path = require("path");

// Read "server_conf.txt lines and split them"
let confs = fs.readFileSync(path.join(__dirname, 'server_conf.txt')).toString().split("\n");

let server_conf = {

  DB: confs[0],  // First line represents mongodb uri
  HOST_IP: confs[1],  // Second line represents the host_ip (aws instance IPv4 DNS)
  PORT: confs[2],  // Third line represents the configured port (express listening port)
  BOT_TELEGRAM_API_TOKEN: confs[3] // Forth line represents Bot token

}

// Debug prints
console.log('*'+server_conf.DB+'*')
console.log('*'+server_conf.HOST_IP+'*')
console.log('*'+server_conf.PORT+'*')

// Exports
module.exports = server_conf

