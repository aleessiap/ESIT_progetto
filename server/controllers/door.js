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
  console.log('Get door controller parameter ' + req.param("_id"));
  let id = mongoose.Types.ObjectId(req.param("_id"));
  Door.findOne({_id: id}, (err, door) => {

    if(err) {
      console.log('Error occurred');
      res.send(err);

    }
    if(!door) {
      res.json(door);

      console.log("Door not found!");

    }else{
      console.log("Door found");
      console.log(door);
      res.status(200).json({
        success: true,
        doorFound: door
      })
    }

  })

}


module.exports.insertDoor = function (req, res) {
  //req.save().then(r => console.log('Saved')); //salvo il nuovo utente nel db
  //return req;
  console.log('Create door controller')
  Door.create(req.body, (err, door) => {

    if(err) {

      res.send(err);

    }
    else{

      res.json(door);

    }

  })

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

    }

  })
}

module.exports.searchDoor = function (req, res) {
  console.log("Search suggestion door " + req.param("name"))

  Door.find( { name: new RegExp(req.param("name"), "i")  },
    function (err, doors) {
      if(err) {
        console.log('Error occurred');
        res.send(err);
      }
      if(!doors) {
        res.json(doors);
        console.log("doors not found!");

      }else{
        console.log("doors found in suggestion");
        //users = users.map(function(item) { return item.doc; });
        //res.status(200)
        res.json(doors)
        console.log(doors)
      }
    })
}
