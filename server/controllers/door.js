const Door = require('../models/door');

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

  Door.findOne({name: req.param("name")}, (err, doc) => {

    if(err) {

      res.send(err);

    }
    else {

      res.json(doc);

    }

  })

}


module.exports.insertDoor = function (req, res) {

  Door.create(req.body, (err, doc) => {

    if(err) {

      res.send(err);

    }
    else{

      res.json(doc);

    }

  })

}

module.exports.updateDoor = function (req, res) {

  Door.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {

    if(err) {

      res.send(err)

    }
    else {

      res.json(doc);

    }

  })

}

module.exports.deleteDoor = function (req, res) {

  Door.findByIdAndDelete(req.param("name"), function (err) {

    if (err) {

      res.send(err);

    }
    else {

      console.log('Document deleted');

    }

  })

}
