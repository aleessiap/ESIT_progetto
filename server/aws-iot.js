const AwsIot = require('aws-iot-device-sdk');
const Door = require('./models/door')

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

          //device.subscribe('$aws/things/' + thing_name + '/shadow/update/rejected');
          //device.subscribe('$aws/things/' + thing_name + '/shadow/update/delta');
          //device.subscribe('$aws/things/' + thing_name + '/shadow/update/documents');

        }

      }


    })

  });

device.on('message', function(topic, payload) {

    console.log('message', topic, payload)

    payload = JSON.parse(payload)
    if (payload["state"]["reported"] === undefined) return;

    let aws_thing_name = topic.split('/')[2];

    Door.findOne({aws_thing_name: aws_thing_name}, ((err, doc) => {

      if (err) {

        console.log(err)

      }
      else {

        if (payload["state"]["reported"]["last_password"] === undefined) {



        }
        else {

          let user_id = doc['authorizations'][payload["state"]["reported"]["last_password"]]
          let access = undefined

          if (user_id === undefined) {

            access = 0

          } else {

            access = 1

          }

          let update = {

            "state": {

              "desired": {

                "access": access

              }

            }

          }

          device.publish('$aws/things/' + aws_thing_name + '/shadow/update', JSON.stringify(update))

        }

      }

    })

    )

  });

module.exports = device
