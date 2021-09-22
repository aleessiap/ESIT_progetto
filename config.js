const fs = require('fs')
const path = require("path");

let confs = fs.readFileSync(path.join(__dirname, 'server_conf.txt')).toString().split("\n");

let server_conf = {

  DB: confs[0],
  HOST_IP: confs[1]

}


module.exports = server_conf

