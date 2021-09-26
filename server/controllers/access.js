const Access = require('../models/access');
const mongoose = require("mongoose");
const User = require("../models/user")

// Search all access
module.exports.getAllAccess = function (req, res) {

  try {

    Access.find({}, (err, docs) => {

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

// Get all access of a door
module.exports.getAccessByDoorId = function (req, res) {

  try {

    Access.find({door_id: mongoose.Types.ObjectId(req.params["_id"])}, (err, docs) => {

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

// Get all access of a door by a user
module.exports.getAccessByDoorIdAndUserId = function (req, res) {

  try {

    Access.find({door_id: mongoose.Types.ObjectId(req.params["door_id"]), user_id:mongoose.Types.ObjectId(req.params["user_id"])}, (err, docs) => {

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

// Get a single access by its id
module.exports.getAccess = function (req, res) {

  try{

    Access.findById(req.param["_id"], (err, doc) => {

      if(!doc) {

        res.status(403).json({success:false, msg:'Accesso non trovato'});

      } else {

        res.status(200).json(doc);

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

// Insert a new access
module.exports.insertAccess = function (req, res) {
  console.log('User '+ req.body.user_id)
  console.log('Door '+ req.body.door_id)
  try {
    User.findOne({_id: mongoose.Types.ObjectId(req.body.user_id)}, (err, user) => {
      if (!user) {
        res.status(403).json({
          success: false,
          msg: "User not found"});
      }else{
        if(user.door_list.find(el => el.equals(req.body.door_id))){
          Access.create(req.body, (err, doc) => {

            res.status(200).json({
              success:true,
              msg: "Door authorized"
            });

          })
        }else{
          res.status(403).json({
            success:false,
            msg: 'Door not authorized'
          })
        }
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

// Update a single access by its id
module.exports.updateAccess = function (req, res) {

  try {

    Access.findByIdAndUpdate(req.body._id, req.body, {useFindAndModify:false, returnDocument:"after"}, (err, doc) => {

      if(!doc) {

        res.status(403).json({success:false, msg:'L\'accesso non esiste'});

      } else {

        res.status(200).json(doc);

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

// Delete an access
module.exports.deleteAccess = function (req, res) {

  try {

    Access.findByIdAndDelete(req.params["_id"], {useFindAndModify:false, returnDocument:"after"},function (err, doc) {

        if(!doc) {

          res.status(403).send({success:false, msg:'L\'accesso non esiste'})

        } else {

          res.status(200).send(doc);

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
