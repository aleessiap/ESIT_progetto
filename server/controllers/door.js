const Door = require('../models/door');
const User = require('../models/user');

const {device} = require('../aws-iot');
const {sendUpdate} = require('../aws-iot');

const mongoose = require("mongoose");

module.exports.lockDoor = function (req, res) {

  Door.findById(req.body._id, (err, door) => {

    if (err) {

      res.status(500).json({
        type: "An error accurred",
        msg: err
      })

    } else {

      if (!door) {

        res.status(403).json({success:false, msg:"Door not found!"});

      } else {

        if(door.state !== 0) {

          sendUpdate(door.aws_thing_name, 0, -1)

          res.status(200).json({

            success: true,
            doorFound: door

          })


        } else {

          res.status(403).json({success:false, msg:"Door already locked!"});

        }

      }

    }

  })

}

module.exports.unlockDoor = function (req, res) {

  Door.findById(req.body._id, (err, door) => {

    if (err) {

      res.status(500).json({
        type: "An error accurred",
        msg: err
      })

    } else {

      if (!door) {

        res.status(403).json({success:false, msg:"Door not found"});

      } else {

        if(door.state === 0) {


          sendUpdate(door.aws_thing_name, 3, -1)

          res.status(200).json({

            success: true,
            doorFound: door

          })

        } else {

          res.status(403).json({success:false, msg:"Door already unlocked!"});

        }

      }

    }

  })

}

module.exports.getAllDoors = function (req, res) {

  Door.find({}, (err, docs) => {

    if (err) {
      res.status(500).json({
        type: "Si e\' verificato un errore",
        msg: err
      })
    }
    else {
      res.status(200).json(docs);
    }

  })

}

module.exports.getDoorsByUserId = function (req, res) {

  User.findById(mongoose.Types.ObjectId(req.params['_id']), {_id:0, door_list:1}, (err, doc) => {

    if (err) {
      res.status(500).json({
        type: "Si e\' verificato un errore",
        msg: err
      })
    }
    else {

      Door.find({_id: {$in: doc['door_list']}}, (err1, docs) => {

        if (err1) {

          res.status(500).json({
            type: "Si e\' verificato un errore",
            msg: err1
          })

        } else {

          res.status(200).json(docs);

        }

      })

    }

  })

}

module.exports.getDoor = function (req, res) {
  //console log per far vedere i dati salvati in sessione quando si apre la dashboard
  console.log("Session: " + req.session.userid + " " + req.session.admin) ;

  console.log('Get door controller parameter ' + req.params["_id"]);
  let id = mongoose.Types.ObjectId(req.params["_id"]);
  Door.findOne({_id: id}, (err, door) => {

    if(err) {
      res.status(500).json({
        type: "Si e\' verificato un errore",
        msg: err
      })
    }
    if(!door) {

      res.status(403).json({success:false, msg:"Door not found"});

    }else{
      res.status(200).json({
        success: true,
        doorFound: door
      })
    }

  })

}


module.exports.insertDoor = async function (req, res) {
  let countName = 0;
  let countAws = 0;
  console.log("req create door")
  console.log(req.body)
  try {
    await Door.count({name: req.body.name}, function (err, count) {
      countName = count;
    }, err => console.log(err));

    await Door.count({aws_thing_name: req.body.aws_thing_name}, function (err, count) {
      countAws = count;

    }, err => console.log(err));
    if(countAws === 0 && countName === 0){
      await Door.create(req.body, (err, door) => {

        if (err) {
          res.status(500).json({
            type: "Si e\' verificato un errore nella creazione della porta",
            msg: err
          })
        } else {

          device.subscribe('$aws/things/' + door.aws_thing_name + '/shadow/update/accepted');
          device.subscribe('$aws/events/presence/connected/' + door.aws_thing_name);
          device.subscribe('$aws/events/presence/disconnected/' + door.aws_thing_name);
          res.status(200).json(door);
        }

      });
    }else{
      res.status(403).json({
        success: false,
        countName: countName,
        countAws: countAws
      })
    }

  }catch(err){
    console.log(err)
    res.status(500).json({
      type: "Si e\' verificato un errore nella creazione della porta",
      msg: err
    })
  }
}

module.exports.updateDoor = async function (req, res) {
  console.log('Update door controller')
  let countName = 0;
  let countAws = 0;

  console.log("body update door : current door")
  console.log(req.body.currentDoor)
  console.log("data : form data ")
  console.log(req.body.data)
  try {

    if(req.body.name) {
      await Door.count({name: req.body.data.name}, function (err, count) {
        countName = count;
      }, err => console.log(err));
    }
    if(req.body.aws) {
      await Door.count({aws_thing_name: req.body.data.aws_thing_name}, function (err, count) {
        countAws = count;

      }, err => console.log(err));
    }
    if(countAws === 0 && countName === 0){
      Door.findByIdAndUpdate(req.body.currentDoor._id, req.body.data, {
        useFindAndModify: false,
        returnDocument: "after"
      }, (err, door) => {

        if (err) {
          res.status(500).json({
            type: "Si e\' verificato un errore nella modifica della porta",
            msg: err
          })
        } else {

          if (!door) {

            res.status(403).json({success: false, msg: 'La porta non esiste'})

          } else {

            res.status(200).json(door);

          }

        }

      })}else{
      res.status(403).json({
        success: false,
        msg: 'I dati inseriti non sono accettabili',
        countName: countName,
        countAws: countAws
      })
    }

  }catch(err){
    console.log(err)
    res.status(500).json({
      type: "Si e\' verificato un errore nella modifica della porta",
      msg: err
    })
  }
}

module.exports.deleteDoor = function (req, res) {
  console.log("Deleting door")

  let id = mongoose.Types.ObjectId(req.param("_id"));
  Door.findByIdAndDelete(id, {useFindAndModify: false, returnDocument: "after"}, function (err, door) {

    if (err) {
      res.status(500).json({
        type: "Si e\' verificato un errore nella cancellazione della porta",
        msg: err
      })
    } else {
      if (!door) {

        res.status(403).json({success: false, msg: 'La porta non esiste'})

      } else {

        res.status(200).json(door);

      }
    }

  })
}

module.exports.searchDoor = function (req, res) {
  console.log("Search suggestion door " + req.param("name"))

  Door.find({name: new RegExp(req.param("name"), "i")},
    function (err, doors) {
      if (err) {
        res.status(500).json({
          type: "Si e\' verificato un errore",
          msg: err
        })
      } else {
        res.status(200).json(doors)
      }
    })
}

module.exports.searchDoorByUserId = function (req, res) {
  console.log("Search suggestion door " + req.param("name"))

  User.findById(req.param("user_id"), {_id: 0, door_list: 1}, function (err, doc) {

    if (err) {

      res.status(500).json({
        type: "Si e\' verificato un errore",
        msg: err
      })

    } else {

      Door.find({$and: [{name: new RegExp(req.param("name"), "i")}, {_id: {$in: doc['door_list']}}]},
        function (err1, doors) {
          if (err1) {
            res.status(500).json({
              type: "Si e\' verificato un errore",
              msg: err1
            })
          } else {
            res.status(200).json(doors)
          }
        })

    }

  })
}


