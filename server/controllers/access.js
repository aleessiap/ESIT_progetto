const Access = require('../models/access');

module.exports.getAllAccess = function (req, res) {

  Access.find({}, (err, docs) => {

    if (err) {

      console.log(err.message);

    }
    else {

      res.json(docs);

    }

  })

}

module.exports.getAccess = function (req, res) {

  Access.find({_id: req.body._id}, (err, docs) => {

    if(err) {

      console.log(err.message);

    }
    else {

      res.json(docs);

    }

  })

}


module.exports.insertAccess = function (req, res) {

  Access.create({user_id: req.body.user_id, door_id: req.body.door_id})

}

module.exports.updateAccess = function (req, res) {

  Access.findByIdAndUpdate(req.body._id, req.body)

}

module.exports.deleteAccess = function (req, res) {

  Access.findByIdAndDelete(req.body._id, function (err) {

    if (err) {

      console.log(err.message);

    }
    else {

      console.log('Document deleted');

    }

  })

}
