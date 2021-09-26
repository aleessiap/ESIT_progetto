const Door = require('../models/door');
const User = require('../models/user')
const mongoose = require("mongoose");
const bot = require('./../bot-telegram');
const {generateRandomPassword} = require('./../passwd');
const {createHash} = require('./../passwd');
const {NUMBERS} = require('./../passwd');

// Get all authorizations
module.exports.getAllAuthorizations = function (req, res) {
  try {

    // Search all doors and project the authorization field
    Door.find({}, {authorizations: 1, _id: 0}, (err, docs) => {


      res.status(200).json(docs);

    })
  } catch (err) {

    // Send error
    console.log(err)
    res.status(500).json({
      type: "Si e\' verificato un errore",
      msg: err
    })

  }

}

// get all users not authorized (method not used)
// module.exports.getAllNotAuthorized = function (req, res) {
//
//   try {
//     Door.find({}, {authorizations: 1, _id: 0}, (err, docs) => {
//
//
//       res.status(200).json(docs);
//
//     })
//   } catch (err) {
//
//     console.log(err)
//     res.status(500).json({
//       type: "Si e\' verificato un errore",
//       msg: err
//     })
//
//   }
//
// }

// Get all users authorized to access a door (old method not used)
/*module.exports.getAuthorizations = function (req, res) {

  Door.findById(mongoose.Types.ObjectId(req.params["_id"]), (err, doc) => {

    if(err) {
      res.send(err)
    }
    else {
      let auths = doc['authorizations']['_doc']
      let users_id = []

      for (const pin in auths) {
        users_id.push(auths[pin])
      }

      User.find({_id: {$in: users_id}}, (err, docs) => {

        if(err) {
          res.send(err)
        }
        else {
          res.json(docs)
        }
      })

    }

  })

}*/

// Get all users authorized to access a door
module.exports.getAuthorizations = function (req, res) {
  try {
    // Search all the users that have the requested door's id in the door_list parameter
    User.find({door_list: mongoose.Types.ObjectId(req.params["_id"])}, (err, docs) => {

      res.status(200).send(docs)

    })
  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "Si e\' verificato un errore",
      msg: err
    })

  }

}

// Get all users not authorized to use a door (old method not used)
/*module.exports.getNotAuthorized = function (req, res) {

  Door.findById(mongoose.Types.ObjectId(req.params["_id"]), (err, doc) => {

    if(err) {
      res.send(err)
    }
    else {

      let auths = doc['authorizations']['_doc']
      let users_id = []

      for (const pin in auths) {
        users_id.push(auths[pin])
      }

      User.find({_id: {$nin: users_id}}, (err, docs) => {

        if(err) {
          res.send(err)
        }
        else {
          res.json(docs)
        }

      })

    }

  })

}*/


// Get all users not authorized to use a door
module.exports.getNotAuthorized = function (req, res) {
  try {
    // Search all the users that doesnt have the requested door's id in the door_list parameter
    User.find({door_list: {$not: {"$eq": mongoose.Types.ObjectId(req.params["_id"])}}}, (err, docs) => {

      res.status(200).send(docs)

    })
  } catch (err) {

    // Send error
    console.log(err)
    res.status(500).json({
      type: "Si e\' verificato un errore",
      msg: err
    })

  }

}

// Insert a new authorization
module.exports.insertAuthorization = function (req, res) {

  let user = undefined

  try {

    // Search the user to be authorized
    User.findById(mongoose.Types.ObjectId(req.body.user_id), (err, doc) => {

      // If the user has not the chat_id field then he has to perform the first access.
      if( (doc.chat_id) !== undefined ){

        user = doc
        // Search the door
        Door.findById(mongoose.Types.ObjectId(req.body.door_id), (err, doc) => {

          // Send error
          if(err) {
            res.status(500).json({
              type: "Si e\' verificato un errore",
              msg: err
            })
          }
          else {

            // Generate a new pin for the user
            let pin = ''
            let pinHash = ''

            do { // Generate a random pin that still doesnt exists

              pin = generateRandomPassword(6, NUMBERS)
              pinHash = createHash('sha256').update(pin).digest('base64')

            } while (pinHash in  Object.keys(doc['authorizations']['_doc']))

            // Add the user to the authorizations setting a new key (the pin) in the authorization map
            // <new generated pin>[key] -> <user_id>[value]
            Door.collection.findOneAndUpdate({_id: doc._id}, {$set:{['authorizations.'.concat(pinHash)]:mongoose.Types.ObjectId(req.body.user_id)}}, {returnDocument: "after"}, (err1, doc1) => {

              // Send error
              if(err1) {
                res.status(500).json({
                  type: "Si e\' verificato un errore",
                  msg: err1
                })
              }
              else {

                // Add the door to the users accessible doors
                // This field is used to speed up certain operations
                user.door_list.push(mongoose.Types.ObjectId(doc._id))
                User.findOneAndUpdate({_id: user._id}, {door_list: user.door_list}, {useFindAndModify: false, returnDocument: "after"}, (err2)=>{

                  // Send error
                  if(err2){

                    res.status(500).json({
                      type: "Si e\' verificato un errore",
                      msg: err2
                    })

                  } else {

                    // Notify the user that he can access to the door
                    bot.sendMessage(user.chat_id, "Ora puoi accedere alla porta \"" + doc.name + "\" con il pin: " + pin).then()
                    res.status(200).json(doc1)

                  }

                })

              }

            })

          }

        })
      }
      else {

        // The use have to perform the first access procedure
        res.status(403).json({
          found: false,
          success: false,
          msg:'L\'utente deve prima completare la procedura di primo accesso.'

        })

      }

    })

  } catch (err) {

    // Send errors
    console.log(err)
    res.status(500).json({
      type: "Si e\' verificato un errore",
      msg: err
    })

  }



}

// Update the authorization
// module.exports.updateAuthorization = function (req, res) {
//
//   Door.findById(mongoose.Types.ObjectId(req.body._id), function (err, doc) {
//
//     if (err) {
//       res.send(err);
//     }
//     else {
//
//       let user = doc['authorization']['_doc'][req.body.old_pin];
//       doc['authorization']['_doc'][req.body.old_pin] = undefined;
//       doc['authorization']['_doc'][req.body.new_pin] = user;
//       Door.findByIdAndUpdate(doc._id, doc);
//       res.send(doc);
//
//     }
//
//   })
//
// }


// Delete authorization
module.exports.deleteAuthorization = function (req, res) {

  // Search the door
  Door.findById(mongoose.Types.ObjectId(req.params["door_id"]), function (err, doc) {

    if (err) {

      // Send error
      res.status(403).json(err)

    }
    else {

      // Search the user
      User.findById(mongoose.Types.ObjectId(req.params["user_id"]), function (err1, doc1) {

        if(err1) {

          res.status(403).json(err1)

        } else {

          // Search the user's pin for this door
          let pins = Object.keys(doc['authorizations']['_doc'])
          let pin = undefined

          // Search the pin
          for (let x of pins) {

            // If the user id is equal to the value corresponding to the actual pin
            if (mongoose.Types.ObjectId(req.params["user_id"]).equals(doc['authorizations']['_doc'][x])) {

              // Pin to be removed found
              pin = x
              break

            }

          }

          // Remove the pin in the authorizations map. The user will not be able to access anymore to the door
          Door.collection.findOneAndUpdate({_id: doc._id}, {$unset: {['authorizations.'.concat(pin)]: 1}}, {useFindAndModify: false, returnDocument: "after"}, (err2) => {

            if (err2) {

              // Send error
              res.status(403).json(err2)

            } else {

              // Update user's door_list field to remove the door from the list of its accessible doors
              doc1.door_list.splice(doc1.door_list.indexOf(mongoose.Types.ObjectId(req.params["door_id"])))

              User.findOneAndUpdate({_id: doc1._id}, {door_list: doc1.door_list}, {useFindAndModify: false, returnDocument:"after"}, function (err3, doc3) {

                if(err3){

                  // Send error
                  res.status(403).json(err3)

                } else {

                  // Notify the user
                  bot.sendMessage(doc1.chat_id, "Non puoi piu\' accedere alla porta \"" + doc.name + "\".").then()
                  res.status(200).json(doc3)

                }

              })

            }

          })

        }

      })

    }

  })

}
