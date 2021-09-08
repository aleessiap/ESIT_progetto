const Door = require('../models/door');
const User = require('../models/user')
const Authorization = require('../models/authorization')
const mongoose = require("mongoose");
const {randomInt} = require("crypto");
const bot = require('./../bot-telegram')

module.exports.getAllAuthorizations = function (req, res) {

  Door.find({}, {authorizations: 1, _id: 0}, (err, docs) => {

    if (err) {

      res.send(err);

    }
    else {

      res.json(docs);

    }

  })

}

module.exports.getAllNotAuthorized = function (req, res) {

  Door.find({}, {authorizations: 1, _id: 0}, (err, docs) => {

    if (err) {

      res.send(err);

    }
    else {

      res.json(docs);

    }

  })

}

module.exports.getAuthorizations = function (req, res) {

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

}

module.exports.getNotAuthorized = function (req, res) {

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

}


module.exports.insertAuthorization = function (req, res) {

  let user = undefined

  User.findById(mongoose.Types.ObjectId(req.body.user_id), (err, doc) => {

    if(err) {

      res.send(err)

    } else {

      if(!user.chat_id){

        res.status(400).json({
          type: "Not Found",
          msg: "The user need to perform the first access procedure."
        })

      } else {

        user = doc

      }

    }

  })

  Door.findById(mongoose.Types.ObjectId(req.body.door_id), (err, doc) => {

    if(err) {

      res.send(err)

    }
    else {

      let update = {}
      let value = {}
      let pin = ''

      do {

        pin = randomInt(100000, 1000000)
        pin = '' + pin

      } while (pin in  Object.keys(doc['authorizations']['_doc']))

      Door.collection.findOneAndUpdate({_id: doc._id}, {$set:{['authorizations.'.concat(pin)]:mongoose.Types.ObjectId(req.body.user_id)}}, {returnDocument: "after"}, (err1, doc1) => {

        if(err1) {

          res.send(err1)

        }
        else {

          bot.sendMessage(user.chat_id, "You can now access to door \"" + doc.name + "\" with pin: " + pin)
          res.json(doc1)

        }

      })

    }

  })

}

module.exports.updateAuthorization = function (req, res) {

  Door.findById(mongoose.Types.ObjectId(req.body._id), function (err, doc) {

    if (err) {

      res.send(err);

    }
    else {

      let user = doc[req.body.old_pin];
      doc[req.body.old_pin] = undefined;
      doc[req.body.new_pin] = user;
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

      let update = {}
      let value = {}
      let pins = Object.keys(doc['authorizations']['_doc'])
      let pin = undefined

      for (let x of pins) {

        if(mongoose.Types.ObjectId(pins[x]) === mongoose.Types.ObjectId(req.params["user_id"])) {

            pin = x
            console.log
            break
        }

      }

      Door.collection.findOneAndUpdate({_id: doc._id}, {$unset:{['authorizations.'.concat(pin)]:1}}, {returnDocument: "after"}, (err1, doc1) => {

        if(err1) {
          res.send(err1)
        }
        else {

          res.json(doc1)

        }

      })

    }

  })

}
