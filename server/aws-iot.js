const AwsIot = require('aws-iot-device-sdk');
const Door = require('./models/door');
const Access = require('./models/access')
const User = require('./models/user')
const mongoose = require("mongoose");
const conf = require('../config');
const {createHash} = require('./passwd');
const path = require("path");

THING_NAME = conf.WEBAPP_THING_NAME

// Connection to aws IoT platform using released certs
// device = AwsIot.device({
//
//   keyPath: path.join(__dirname, 'certs/aef2eeadc93f477becfd1ee3b7589fff665bfeae89d39e90754f7e51ff047d4c-private.pem.key'),
//   certPath: path.join(__dirname, 'certs/aef2eeadc93f477becfd1ee3b7589fff665bfeae89d39e90754f7e51ff047d4c-certificate.pem.crt'),
//   caPath: path.join(__dirname, 'certs/AmazonRootCA1.pem'),
//   clientId: THING_NAME,
//   host: 'a19up4beoeskf3-ats.iot.us-east-1.amazonaws.com',
//   keepalive: 60
//
// });

// Connection to aws IoT platform using released certs
device = AwsIot.device({

  keyPath: conf.PRIVATE_KEY_THING_PATH,
  certPath: conf.CERTIFICATE_THING_PATH,
  caPath: conf.AMAZON_ROOT_CA_PATH,
  clientId: conf.WEBAPP_THING_NAME,
  host: conf.AWS_MQTT_HOST,
  keepalive: 60

});

// Define behavior on connection
device.on('connect', function() {

  // Find all doors
  Door.find({}, {aws_thing_name:1, _id:0}, (err, docs) => {

    // Check errors
    if(err) {

      console.log(err)

    }
    else {

      // Subscribe to all door's topics registered in the system
      for(let doc in docs) {

        let thing_name = docs[doc]['aws_thing_name']
        device.subscribe('$aws/things/' + thing_name + '/shadow/update/accepted');
        device.subscribe('$aws/events/presence/connected/' + thing_name);
        device.subscribe('$aws/events/presence/disconnected/' + thing_name);

      }

    }

  })

});

// Send a state update to a device
function sendUpdate(aws_thing_name, update, reset_after = -1) {

  // update json definition
  let update_json = {

    "state": {

      "desired": {

        "d_state": update

      }

    }

  }

  // Search the door to be updated
  Door.findOneAndUpdate({aws_thing_name: aws_thing_name}, {state: update}, {useFindAndModify: false, returnDocument:"after"}, (err, door) => {

    // Check errors
    if(err) {

      console.log(err)

    } else {

      // Check if door was found
      if(!door) {

        console.log("Error!\n Door " + aws_thing_name + " not found")

      } else {

        // Set door state
        device.publish('$aws/things/' + aws_thing_name + '/shadow/update', JSON.stringify(update_json))
        // console.log('updated state to ', doc['state'])

      }

    }

  })

  // If reset_after >= 0 then reset option is enabled
  if (reset_after >= 0) {

    // Use setTimout to execute a delayed function
    setTimeout(() => {

      // Modify state field and search the door to be re-setted
      update_json['state']['desired']['d_state'] = 3
      Door.findOneAndUpdate({aws_thing_name: aws_thing_name}, {state: 3}, {useFindAndModify: false, returnDocument:"after"}, (err, door) => {

        // Check for errors
        if(err) {

          console.log(err)

        } else {

          // Check if door was found
          if(!door) {

            console.log("Error!\n Door " + aws_thing_name + " not found")

          } else {

            // Reset door to state 3 (wait for pin insertion state)
            device.publish('$aws/things/' + aws_thing_name + '/shadow/update', JSON.stringify(update_json))
            // console.log('updated state to ', doc['state'])

          }

        }


      })

    }, reset_after * 1000);

  }

}

// Listen devices events (connections, disconnections, pin insertions)
function listen_devices(server, bot) {

  // Define behavior on mqtt message received
  device.on('message', function (topic, payload) {

    // Read and parse the json
    payload = JSON.parse(payload)

    // "Parse" the topic to recognize event
    if (topic.split('/')[1] === 'events') { // The topic "events" concerns connection or disconnection events from devices

      let aws_thing_name = topic.split('/')[4] // Get the thing name that made aws iot emit the message
      let connected = false

      // Search the door using the thing name
      Door.findOneAndUpdate({aws_thing_name: aws_thing_name}, {online: connected}, {useFindAndModify: false}, (err, doc) => {

        if(err) {

          console.log(err)

        } else {

          if(topic.split('/')[3] === 'connected') { // The device has been connected

            connected = true
            console.log(aws_thing_name, " connected!")

          } else { // The device has been disconnected

            connected = false
            console.log(aws_thing_name, " disconnected!")

          }

        }

      })

    } else if (payload["state"]["reported"]) { // In this case a pin was inserted by a user to the device

      let aws_thing_name = topic.split('/')[2]; // Get the thing name and search the door

      Door.findOneAndUpdate({aws_thing_name: aws_thing_name}, {online:true}, {useFindAndModify:false, returnDocument:"after"},(err, doc) => {

        if (err) {

          console.log(err)

        } else {

          if (payload["state"]["reported"]["last_password"]) { // Check if this is a pin insertion

            // Extract info:
            // Create the hash of the pin (the correct pin is stored in has form in the db)
            let last_password = createHash('sha256').update(payload["state"]["reported"]["last_password"]).digest('base64')

            // Get the user id using the authorizations HashMap (json)
            let user_id = doc['authorizations']['_doc'][last_password]

            // Get the door _id
            let door_id = doc['_id']
            let d_state = undefined;

            if (user_id === undefined) { // If the user is undef then the inserted pin doesnt belong to any user (uncorrect pin)

              // Set device to state 1 (DENY access, failed access)
              sendUpdate(aws_thing_name, 1, 5)

            } else {

              // Search the user that inserted the pin
              User.findById(user_id, (err1, doc1) => {

                if (err1) {

                  console.log(err1)
                  // In case of error set device to state (DENY access, failed access)
                  sendUpdate(aws_thing_name, 1, 5)
                  return undefined

                } else {

                  // Create a verification link
                  let expired = false
                  let user = doc1
                  let passwd = payload["state"]["reported"]["last_password"]

                  // To create averification string use inserted pin, user_id, door_id and current time and hash them together
                  let link_string = createHash('sha256').update(passwd + '/' + user_id + '/' + door_id + '/' + Date.now().toLocaleString()).digest('hex')

                  // Send the link to the user using the telegram bot
                  bot.sendMessage(user.chat_id, 'Clicca questo link per sbloccare la porta:\n' + doc['name'] + '\nhttp://' + conf["HOST_IP"] + '/api/verify/' + link_string).then()

                  // Serve the link and wait for requests
                  server.get("/api/verify/" + link_string, ((req, res) => {

                      // The link expires after 10 seconds
                      if (expired) {

                        res.send('Link scaduto!')

                      } else {

                        // If someone click on this link, the link is set to expired anc cannot be used anymore to unlock the door
                        expired = true

                        // Check again if the user can access to the door
                        if(user.door_list.find(d => d.equals(door_id))){

                          // Create access
                          Access.create({door_id: door_id, user_id: user_id}, (err2, doc2) => {

                            if (err2) {

                              // In case of error set device to state (DENY access, failed access)
                              sendUpdate(aws_thing_name, 1, 5)
                              res.send(err2)

                            } else {

                              // Set device to state (ALLOW access, successful access)
                              sendUpdate(aws_thing_name, 2, 5)
                              res.send("La porta " + doc['name'] + " è stata aperta!");

                            }

                          });

                        }else{
                          // The user isn't allowed to open this door
                          res.send("L'utente non e\' autorizzato all'accesso");

                        }
                      }

                    }
                  ))

                  // after 10 seconds disable the link
                  setTimeout(() => {

                    if (!expired) {
                       // set device state to 1 (Deny access, failed access)
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

// Exports
module.exports.device = device
module.exports.sendUpdate = sendUpdate
module.exports.listen_device = listen_devices
