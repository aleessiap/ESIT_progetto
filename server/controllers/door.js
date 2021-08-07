const Door = require('../models/door');

module.exports.getAllDoor = function (req, res) {

  Door.find({}, (err, docs) => {

    if (err) {

      console.log(err.message);

    }
    else {

      res.json(docs);

    }

  })

}

module.exports.getDoor = function (req, res) {

  Door.find({_id: req.body._id}, (err, docs) => {

    if(err) {

      console.log(err.message);

    }
    else {

      res.json(docs);

    }

  })

}


module.exports.insertDoor = function (req, res) {

  Door.create(req.body)

}

module.exports.updateDoor = function (req, res) {

  Door.findByIdAndUpdate(req.body._id, req.body)

}

module.exports.deleteDoor = function (req, res) {

  Door.findByIdAndDelete(req.body._id, function (err) {

    if (err) {

      console.log(err.message);

    }
    else {

      console.log('Document deleted');

    }

  })

}
