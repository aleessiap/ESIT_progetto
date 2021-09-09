const AwsIot = require('aws-iot-device-sdk');
const Door = require('./models/door');
const Access = require('./models/access')
const User = require('./models/user')
const mongoose = require("mongoose");
const {createHash} = require("crypto");

THING_NAME = 'APP'

device = AwsIot.device({

  keyPath: './certs/1fe372aea6dd66fc84e58e27c45f8c255c555868aa0fc51f1867d86c1b7dc98b-private.pem.key',
  certPath: './certs/1fe372aea6dd66fc84e58e27c45f8c255c555868aa0fc51f1867d86c1b7dc98b-certificate.pem.crt',
  caPath: './certs/AmazonRootCA1.pem',
  clientId: THING_NAME,
  host: 'a19up4beoeskf3-ats.iot.us-east-1.amazonaws.com'

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

      }

    }

  })

});

function listen_device(server, bot) {

  device.on('message', function (topic, payload) {

    payload = JSON.parse(payload)
    if (payload["state"]["reported"] === undefined) return;

    let aws_thing_name = topic.split('/')[2];

    Door.findOne({aws_thing_name: aws_thing_name}, ((err, doc) => {

        if (err) {

          console.log(err)

        } else {

          if (payload["state"]["reported"]["last_password"] === undefined) {


          } else {

            let last_password = payload["state"]["reported"]["last_password"]
            let user_id = doc['authorizations']['_doc'][last_password]
            let door_id = doc['_id']
            let d_state = undefined;

            if (user_id === undefined) {

              sendUpdate(aws_thing_name, 1, 2)

            } else {

              User.findById(user_id, (err1, doc1) => {

                if (err1) {

                  console.log(err1)
                  sendUpdate(aws_thing_name, 1, 2)
                  return undefined

                } else {

                  let expired = false
                  let user = doc1

                  link_string = createHash('sha256', user_id + '/' + door_id + '/' + Date.now().toLocaleString()).digest('hex')

                  bot.sendMessage(user.chat_id, 'Click this link to unlock the door:').then()
                  bot.sendMessage(user.chat_id, 'http://192.168.1.26:8080/verify/' + link_string).then()

                  server.get("/verify/" + link_string, ((req, res) => {

                    if (expired) {

                      res.send('Link expired!')

                    } else {

                      expired = true
                      Access.create({door_id: door_id, user_id: user_id}, (err2, doc2) => {

                        if (err2) {

                          sendUpdate(aws_thing_name, 1, 2)
                          res.send(err2)

                        } else {

                          sendUpdate(aws_thing_name, 2, 2)
                          res.send("Door " + aws_thing_name + " unlocked!");

                        }

                      });

                    }

                  }))

                  setTimeout(() => {

                    sendUpdate(aws_thing_name, 1, 2)
                    expired = true

                  }, 5 * 1000)

                }

              })

            }

          }

        }

      })
    )

  });


  function sendUpdate(aws_thing_name, update, relisten_after = -1) {

    let update_json = {

      "state": {

        "desired": {

          "d_state": update

        }

      }

    }

    device.publish('$aws/things/' + aws_thing_name + '/shadow/update', JSON.stringify(update_json))

    if (relisten_after >= 0) {

      setTimeout(() => {

        update_json['state']['desired']['d_state'] = 3
        device.publish('$aws/things/' + aws_thing_name + '/shadow/update', JSON.stringify(update_json))

      }, relisten_after * 1000);

    }

  }

}
module.exports.device = device
module.exports.listen_device = listen_device
