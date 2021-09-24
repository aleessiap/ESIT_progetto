const fs = require('fs')
const path = require("path");

let confs = fs.readFileSync(path.join(__dirname, 'server_conf.txt')).toString().split("\n");

let server_conf = {

  DB: confs[0],
  HOST_IP: confs[1],
  PORT: 8080

}

console.log('*'+server_conf.DB+'*')
console.log('*'+server_conf.HOST_IP+'*')
console.log('*'+server_conf.PORT+'*')

module.exports = server_conf

