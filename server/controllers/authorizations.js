const Door = require('../models/door');

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

module.exports.getAuthorizations = function (req, res) {

  Door.findOne({name: req.param("name")}, {authorizations: 1, _id: 0}, (err, doc) => {

    if(err) {

      res.send(err)

    }
    else {

      res.json(doc);

    }

  })

}


module.exports.insertAuthorizations = function (req, res) {


  Door.findOne({name: req.body.door_name}, (err, doc) => {

    if(err) {

      res.send(err)

    }
    else {

      let pin = "1234"
      doc.authorizations[pin] = req.body.user_name
      Door.findByIdAndUpdate(doc._id, doc)
      res.json(doc);

    }

  })

}

module.exports.updateAuthorization = function (req, res) {

  Door.findOne({name: req.body.name}, function (err, doc) {

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

  Door.findOne({name: req.param("name")}, function (err, doc) {

    if (err) {

      res.send(err)

    }
    else {

      doc[req.param("pin")] = undefined;
      Door.findByIdAndUpdate(doc._id, doc);
      console.log('Authorization deleted');

    }

  })

}
