const AwsIot = require('aws-iot-device-sdk');
const Door = require('./models/door');
const Access = require('./models/access')
const User = require('./models/user')
const mongoose = require("mongoose");
const conf = require('../config');
const {createHash} = require('./passwd');
const path = require("path");

THING_NAME = 'APP'

device = AwsIot.device({

  keyPath: path.join(__dirname, 'certs/aef2eeadc93f477becfd1ee3b7589fff665bfeae89d39e90754f7e51ff047d4c-private.pem.key'),
  certPath: path.join(__dirname, 'certs/aef2eeadc93f477becfd1ee3b7589fff665bfeae89d39e90754f7e51ff047d4c-certificate.pem.crt'),
  caPath: path.join(__dirname, 'certs/AmazonRootCA1.pem'),
  clientId: THING_NAME,
  host: 'a19up4beoeskf3-ats.iot.us-east-1.amazonaws.com',
  keepalive: 60

});

device.on('connect', function() {

  Door.find({}, {aws_thing_name:1, _id:0}, (err, docs) => {

    if(err) {

      console.log(err)

    }
    else {

      for(let doc in docs) {

        let thing_name = docs[doc]['aws_thing_name']
        device.subscribe('$aws/things/' + thing_name + '/shadow/update/accepted');
        device.subscribe('$aws/events/presence/connected/' + thing_name);
        device.subscribe('$aws/events/presence/disconnected/' + thing_name);

      }

    }

  })

});

function sendUpdate(aws_thing_name, update, reset_after = -1) {

  let update_json = {

    "state": {

      "desired": {

        "d_state": update

      }

    }

  }

  device.publish('$aws/things/' + aws_thing_name + '/shadow/update', JSON.stringify(update_json))

  Door.findOneAndUpdate({aws_thing_name: aws_thing_name}, {state: update}, {useFindAndModify: false, returnDocument:"after"}, (err, doc) => {

    if (err) {



    } else {

      console.log('updated state to ', doc['state'])

    }

  })

  if (reset_after >= 0) {

    setTimeout(() => {

      update_json['state']['desired']['d_state'] = 3
      device.publish('$aws/things/' + aws_thing_name + '/shadow/update', JSON.stringify(update_json))
      Door.findOneAndUpdate({aws_thing_name: aws_thing_name}, {state: 3}, {useFindAndModify: false, returnDocument:"after"}, (err, doc) => {

        if(err) {



        } else {

          // console.log('updated state to ', doc['state'])

        }


      })

    }, reset_after * 1000);

  }

}

function listen_devices(server, bot) {

  device.on('message', function (topic, payload) {

    payload = JSON.parse(payload)

    if (topic.split('/')[1] === 'events') {

      let aws_thing_name = topic.split('/')[4]
      let connected = false

      if(topic.split('/')[3] === 'connected') {

        connected = true
        console.log(aws_thing_name, " connected!")

      } else {

        connected = false
        console.log(aws_thing_name, " disconnected!")

      }

      Door.findOneAndUpdate({aws_thing_name: aws_thing_name}, {online: connected}, {useFindAndModify: false}, (err, doc) => {

        if(err) {

          console.log(err)

        }

      })

    } else if (payload["state"]["reported"]) {

        let aws_thing_name = topic.split('/')[2];

        Door.findOneAndUpdate({aws_thing_name: aws_thing_name}, {online:true}, {useFindAndModify:false, returnDocument:"after"},(err, doc) => {

          if (err) {

            console.log(err)

          } else {

            if (payload["state"]["reported"]["last_password"]) {

              let last_password = createHash('sha256').update(payload["state"]["reported"]["last_password"]).digest('base64')
              let user_id = doc['authorizations']['_doc'][last_password]
              let door_id = doc['_id']
              let d_state = undefined;

              if (user_id === undefined) {

                sendUpdate(aws_thing_name, 1, 5)

              } else {

                User.findById(user_id, (err1, doc1) => {

                  if (err1) {

                    console.log(err1)
                    sendUpdate(aws_thing_name, 1, 5)
                    return undefined

                  } else {

                    let expired = false
                    let user = doc1

                    let link_string = createHash('sha256').update(user_id + '/' + door_id + '/' + Date.now().toLocaleString()).digest('hex')
                    bot.sendMessage(user.chat_id, 'Clicca questo link per sbloccare la porta:\n' + doc['name'] + '\nhttp://' + conf["HOST_IP"] + '/api/verify/' + link_string).then()

                    server.get("/api/verify/" + link_string, ((req, res) => {

                      if (expired) {

                        res.send('Link scaduto!')

                      } else {

                        expired = true
                        Access.create({door_id: door_id, user_id: user_id}, (err2, doc2) => {

                          if (err2) {

                            sendUpdate(aws_thing_name, 1, 5)
                            res.send(err2)

                          } else {

                            sendUpdate(aws_thing_name, 2, 5)
                            res.send("La porta " + doc['name'] + " è stata aperta!");

                          }

                        });

                      }

                    }))

                    setTimeout(() => {

                      if (!expired) {

                        sendUpdate(aws_thing_name, 1, 5)
                        expired = true

                      }

                    }, 10 * 1000)

                  }

                })

              }

            }

          }

        })

      }

  });

}

module.exports.device = device
module.exports.sendUpdate = sendUpdate
module.exports.listen_device = listen_devices
