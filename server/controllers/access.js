const Access = require('../models/access');
const mongoose = require("mongoose");

module.exports.getAllAccess = function (req, res) {

  try {

    Access.find({}, (err, docs) => {

      res.status(200).json(docs);

    })

  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "An error accurred",
      msg: err
    })

  }

}

module.exports.getAccessByDoorId = function (req, res) {

  try {

    Access.find({door_id: mongoose.Types.ObjectId(req.params["_id"])}, (err, docs) => {

      res.status(200).json(docs);

    })

  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "An error accurred",
      msg: err
    })

  }

}

module.exports.getAccessByDoorIdAndUserId = function (req, res) {

  try {

    Access.find({door_id: mongoose.Types.ObjectId(req.params["door_id"]), user_id:mongoose.Types.ObjectId(req.params["user_id"])}, (err, docs) => {

      res.status(200).json(docs);

    })

  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "An error accurred",
      msg: err
    })

  }

}

module.exports.getAccess = function (req, res) {

  try{

    Access.findById(req.param["_id"], (err, doc) => {

      if(!doc) {

        res.status(403).json({success:false, msg:'Access not found'});

      } else {

        res.status(200).json(doc);

      }

    })

  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "An error accurred",
      msg: err
    })

  }

}


module.exports.insertAccess = function (req, res) {

  try {

    Access.create(req.body, (err, doc) => {

      res.status(200).json(doc);

    })

  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "An error accurred",
      msg: err
    })

  }

}

module.exports.updateAccess = function (req, res) {

  try {

    Access.findByIdAndUpdate(req.body._id, req.body, {useFindAndModify:false, returnDocument:"after"}, (err, doc) => {

      if(!doc) {

        res.status(403).json({success:false, msg:'The access doesn\'t exists'});

      } else {

        res.status(200).json(doc);

      }

    })

  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "An error accurred",
      msg: err
    })

  }

}

module.exports.deleteAccess = function (req, res) {

  try {

    Access.findByIdAndDelete(req.params["_id"], {useFindAndModify:false, returnDocument:"after"},function (err, doc) {

        if(!doc) {

          res.status(403).send({success:false, msg:'The access doesn\'t exists'})

        } else {

          res.status(200).send(doc);

        }

    })

  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "An error accurred",
      msg: err
    })

  }

}
