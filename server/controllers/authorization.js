const Door = require('../models/door');
const User = require('../models/user')
const mongoose = require("mongoose");
const bot = require('./../bot-telegram');
const {generateRandomPassword} = require('./../passwd');
const {createHash} = require('./../passwd');
const {NUMBERS} = require('./../passwd');

module.exports.getAllAuthorizations = function (req, res) {
  try {

    Door.find({}, {authorizations: 1, _id: 0}, (err, docs) => {


      res.status(200).json(docs);

    })
  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "Si e\' verificato un errore",
      msg: err
    })

  }

}

module.exports.getAllNotAuthorized = function (req, res) {

  try {
    Door.find({}, {authorizations: 1, _id: 0}, (err, docs) => {


      res.status(200).json(docs);

    })
  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "Si e\' verificato un errore",
      msg: err
    })

  }

}

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

module.exports.getAuthorizations = function (req, res) {
  try {
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

module.exports.getNotAuthorized = function (req, res) {
  try {
    User.find({door_list: {$not: {"$eq": mongoose.Types.ObjectId(req.params["_id"])}}}, (err, docs) => {

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


module.exports.insertAuthorization = function (req, res) {

  let user = undefined

  try {

    User.findById(mongoose.Types.ObjectId(req.body.user_id), (err, doc) => {

      if( (doc.chat_id) !== undefined ){
        //console.log(doc.chat_id)
        user = doc

        /**res.status(400).json({
          type: "Not Found",
          msg: "The user need to perform the first access procedure."
        })**/
        Door.findById(mongoose.Types.ObjectId(req.body.door_id), (err, doc) => {

          if(err) {
            res.status(500).json({
              type: "Si e\' verificato un errore",
              msg: err
            })
          }
          else {

            let pin = ''
            let pinHash = ''

            do {

              pin = generateRandomPassword(6, NUMBERS)
              pinHash = createHash('sha256').update(pin).digest('base64')

            } while (pinHash in  Object.keys(doc['authorizations']['_doc']))

            Door.collection.findOneAndUpdate({_id: doc._id}, {$set:{['authorizations.'.concat(pinHash)]:mongoose.Types.ObjectId(req.body.user_id)}}, {returnDocument: "after"}, (err1, doc1) => {

              if(err1) {
                res.status(500).json({
                  type: "Si e\' verificato un errore",
                  msg: err1
                })
              }
              else {

                user.door_list.push(mongoose.Types.ObjectId(doc._id))
                User.findOneAndUpdate({_id: user._id}, {door_list: user.door_list}, {useFindAndModify: false, returnDocument: "after"}, (err2)=>{

                  if(err2){

                    res.status(500).json({
                      type: "Si e\' verificato un errore",
                      msg: err2
                    })

                  } else {


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

        res.status(403).json({
          found: false,
          success: false,
          msg:'L\'utente deve prima completare la procedura di primo accesso.'

        })

      }

    })

  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "Si e\' verificato un errore",
      msg: err
    })

  }



}

module.exports.updateAuthorization = function (req, res) {

  Door.findById(mongoose.Types.ObjectId(req.body._id), function (err, doc) {

    if (err) {
      res.send(err);
    }
    else {

      let user = doc['authorization']['_doc'][req.body.old_pin];
      doc['authorization']['_doc'][req.body.old_pin] = undefined;
      doc['authorization']['_doc'][req.body.new_pin] = user;
      Door.findByIdAndUpdate(doc._id, doc);
      res.send(doc);

    }

  })

}

module.exports.deleteAuthorization = function (req, res) {

  Door.findById(mongoose.Types.ObjectId(req.params["door_id"]), function (err, doc) {

    if (err) {
      res.send(err)
    }
    else {

      User.findById(mongoose.Types.ObjectId(req.params["user_id"]), function (err1, doc1) {

        if(err1) {

          res.send(err1)

        } else {

          let pins = Object.keys(doc['authorizations']['_doc'])
          let pin = undefined

          for (let x of pins) {

            if (mongoose.Types.ObjectId(req.params["user_id"]).equals(doc['authorizations']['_doc'][x])) {

              pin = x
              break

            }

          }

          Door.collection.findOneAndUpdate({_id: doc._id}, {$unset: {['authorizations.'.concat(pin)]: 1}}, {useFindAndModify: false, returnDocument: "after"}, (err2) => {

            if (err2) {

              res.send(err2)

            } else {

              doc1.door_list.splice(doc1.door_list.indexOf(mongoose.Types.ObjectId(req.params["door_id"])))

              User.findOneAndUpdate({_id: doc1._id}, {door_list: doc1.door_list}, {useFindAndModify: false, returnDocument:"after"}, function (err3, doc3) {

                if(err3){

                  res.send(err3)

                } else {

                  bot.sendMessage(doc1.chat_id, "Non puoi piu\' accedere alla porta \"" + doc.name + "\".").then()
                  res.send(doc3)

                }

              })

            }

          })

        }

      })

    }

  })

}
