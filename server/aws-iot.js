const AwsIot = require('aws-iot-device-sdk');
const Door = require('./models/door');
const Access = require('./models/access')
const mongoose = require("mongoose");
const server = require("index").server;
const bot = require("index").bot;

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

device.on('message', function(topic, payload) {

  payload = JSON.parse(payload)
  if (payload["state"]["reported"] === undefined) return;

  let aws_thing_name = topic.split('/')[2];

  Door.findOne({aws_thing_name: aws_thing_name}, ((err, doc) => {

      if (err) {

        console.log(err)

      } else {

        if (payload["state"]["reported"]["last_password"] === undefined) {



        }
        else {

          let last_password = payload["state"]["reported"]["last_password"]
          let user_id = doc['authorizations']['_doc'][last_password]
          let door_id = doc['_id']
          let d_state = undefined;

          if (user_id === undefined) {

            d_state = 1

          } else {

            server.get('/verify/' + user_id + '/' + door_id + '/' + Date.now())

            d_state = 2
            Access.create({door_id: door_id, user_id: user_id}, (err1, doc1) => {

              if (err1) {

                console.log(err1)

              } else {

                // console.log(doc1)

              }


            });

          }

          let update = {

            "state": {

              "desired": {

                "d_state": d_state


              }

            }

          }

          device.publish('$aws/things/' + aws_thing_name + '/shadow/update', JSON.stringify(update))

          setTimeout(() => {
            update = {

              "state": {

                "desired": {

                  "d_state": 3

                }

              }

            }

            device.publish('$aws/things/' + aws_thing_name + '/shadow/update', JSON.stringify(update))

          }, 2000);

        }

      }

    })

  )

});

module.exports = device
