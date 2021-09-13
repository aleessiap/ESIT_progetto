const Door = require('../models/door');
const mongoose = require("mongoose");

module.exports.getAllDoors = function (req, res) {

  Door.find({}, (err, docs) => {

    if (err) {
      res.send(err)
    }
    else {
      res.json(docs);
    }

  })

}

module.exports.getDoor = function (req, res) {
  //console log per far vedere i dati salvati in sessione quando si apre la dashboard
  console.log("Session: " + req.session.userid + " " + req.session.admin) ;

  console.log('Get door controller parameter ' + req.param("_id"));
  let id = mongoose.Types.ObjectId(req.param("_id"));
  Door.findOne({_id: id}, (err, door) => {

    if(err) {
      console.log('Error occurred');
      res.send(err);
    }
    if(!door) {
      res.json("Door not found");
      console.log("Door not found!");
    }else{
      res.status(200).json({
        success: true,
        doorFound: door
      })
    }

  })

}


module.exports.insertDoor = function (req, res) {

  Door.create(req.body, (err, door) => {

    if (err) {
      res.send(err);
    } else {
      res.json(door);
    }

  });

}

module.exports.updateDoor = function (req, res) {
  console.log('Update door controller')

  Door.findByIdAndUpdate(req.body.currentDoor._id, req.body.data, (err, door) => {

    if(err) {
      res.send(err)
      console.log(err);
    }
    else {
      res.json(door);
    }

  })

}

module.exports.deleteDoor = function (req, res) {
  console.log("Deleting door")

  let id = mongoose.Types.ObjectId(req.param("_id"));
  Door.findByIdAndDelete(id, function (err) {

    if (err) {
      res.send(err);
      console.log("Error");
      console.log(err)
    }
    else {
      console.log('Door deleted');
      res.json("Door deleted correctly.");
    }

  })
}

module.exports.searchDoor = function (req, res) {
  console.log("Search suggestion door " + req.param("name"))

  Door.find( { name: new RegExp(req.param("name"), "i")  },
    function (err, doors) {
      if(err) {
        res.send(err);
      }
      if(!doors) {
        res.json(doors);
      }
      else{
        res.json(doors)
        console.log(doors)
      }
    })
}
