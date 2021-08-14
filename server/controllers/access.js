const Access = require('../models/access');

module.exports.getAllAccess = function (req, res) {

  Access.find({}, (err, docs) => {

    if (err) {

      console.log(err.message);
      res.json({});

    }
    else {

      res.json(docs);

    }

  })

}

module.exports.getAccess = function (req, res) {

  Access.findById(req.param["_id"], (err, docs) => {

    if(err) {

      res.send(err);

    }
    else {

      res.json(docs);

    }

  })

}


module.exports.insertAccess = function (req, res) {

  Access.create(req.body, (err, doc) => {

    if(err) {

      res.send(err);

    }
    else{

      res.json(doc);

    }

  })

}

module.exports.updateAccess = function (req, res) {

  Access.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {

    if(err) {

      res.send(err)

    }
    else {

      res.json(doc);

    }

  })

}

module.exports.deleteAccess = function (req, res) {

  Access.findByIdAndDelete(req.params["_id"], function (err, doc) {

    if (err) {

      res.send(err)

    }
    else {

      res.send(doc);

    }

  })

}
