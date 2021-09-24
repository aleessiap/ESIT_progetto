const User = require('../models/user')
const mongoose = require("mongoose");
const bot = require("../bot-telegram");
const {createHash} = require("../passwd");
const {generateRandomPassword} = require("../passwd")
const {NUMBERS} = require("../passwd")
const {ALL_CHARS} = require("../passwd")

module.exports.logout = function(req, res) {

  req.session.destroy();
  //console.log("Session: " + req.session+ " " + req.session) ;

  res.json({msg: "Logout effettutato"});
}

module.exports.login = function(req, res){

  const credential = {
    username: req.body.username,
    password: req.body.password
  }

  try{
    User.findOne({$or:[{email: credential.username}, {username: credential.username}]},function (err, user)  {

      if (!user){
        console.log("L\'utente non esiste");
        res.status(403).json({
          success: false,
          msg: "Le credenziali di Login sono errate",
          userFound: "Non trovato"
        })
      } else if(user.chat_id === undefined) {
        console.log(user)
        console.log("No procedura primo accesso");
        res.status(403).json({
          success: false,
          msg: "L'utente non ha effettuato la procedura di primo accesso",
          userFound: "Non trovato"
        })

      } else{
        //console.log(createHash('sha256').update(credential.password).digest('base64'));
        if(createHash('sha256').update(credential.password).digest('base64') === user.password){
          console.log("User found");
          req.session.userid = user._id;
          req.session.admin = user.admin;
          //console.log("Session: " + req.session.userid + " " + req.session.admin) ;

          res.status(200).json({
            success: true,
            msg: "Utente trovato",
            userFound: user
          })
        }else{
          //console.log(user);
          console.log("Password errata");
          res.status(403).json({
            success: false,
            msg: "Password errata",
            userFound: "Non trovato"
          })
        }
      }

    })
  }
  catch(err){
    console.log(err)
    res.status(500).json({
      type: "Si e\' verificato un errore",
      msg: err
    })
  }

}

module.exports.pinRequest = function (req, res) {

  try {
    User.findOne({email: req.body.email}, {chat_id:1, _id:1}, (err, user) => {

      if(!user) {

        console.log("User not found");
        res.status(403).json({
          success: false,
          msg: "L\'utente non esiste"
        })

      } else if(user.chat_id  === undefined) {

        console.log("No procedura primo accesso");
        res.status(403).json({
          success: false,
          msg: "L'utente non ha effettuato la procedura di primo accesso",
          userFound: "Non trovato"
        })

      } else {

        let pin = generateRandomPassword(5, NUMBERS)
        bot.sendMessage(user.chat_id, "Recover pin: " + pin).then()

        req.session.req_user = {}
        req.session.req_user._id = user._id
        req.session.req_user.chat_id = user.chat_id
        req.session.req_user.pin = createHash('sha256').update(pin).digest('base64')
        setInterval(() => { if (req.session && req.session.hasOwnProperty('req_user')) {req.session.destroy()} }, 60 * 1000)

        res.status(200).json({

          success: true,
          msg: "Utente trovato",
          userFound: user

        })

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

module.exports.recoverPassword = function (req, res) {

  if(req.session.hasOwnProperty('req_user')) {

    if (createHash('sha256').update(req.body.pin).digest('base64') === req.session.req_user.pin) {

      try{

        let passwd = generateRandomPassword(6, ALL_CHARS)
        User.findByIdAndUpdate(req.session.req_user._id, {password: createHash('sha256').update(passwd).digest('base64')}, (err, user) => {

          if(!user) {

            req.session.destroy()
            res.status(403).json({
              success: false,
              msg: "L\'utente non esiste"
            })

          } else if( user.chat_id   === undefined) {

            console.log("No procedura primo accesso");
            res.status(403).json({
              success: false,
              msg: "L'utente non ha effettuato la procedura di primo accesso",
              userFound: "Non trovato"
            })

          } else {

            bot.sendMessage(req.session.req_user.chat_id, "La tua nuova password è: " + passwd).then()

            req.session.destroy()
            res.status(200).json({

              success: true,
              msg: "Password resettata",

            })

          }

        })


      } catch (err) {

        console.log(err)
        req.session.destroy()
        res.status(500).json({
          type: "Si e\' verificato un errore",
          msg: err
        })

      }

    } else {

      req.session.destroy()
      res.status(403).json({
        success: false,
        msg: "Pin errato!"
      })

    }

  } else {

    req.session.destroy()
    res.status(403).json({
      success: false,
      msg: "Il tuo PIN di reset è scaduto!"
    })

  }

}

module.exports.getUsers = function(req, res){

  try{

    User.find({},(error, data) => {

      res.status(200).json(data);

    })

  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "Si e\' verificato un errore",
      msg: err
    })

  }
}

module.exports.modifyProfile = async function (req, res) {

  let countEmail = 0;
  let countUsername = 0;
  let countPhone = 0;

  try {
    if(req.body.email) {
      await User.count({email: req.body.profile.email}, function (err, count) {
        countEmail = count;
      }, err => console.log(err));
    }
    if(req.body.phone) {
      await User.count({phone_num: req.body.profile.phone_num}, function (err, count) {
        countPhone = count;
      }, err => console.log(err));
    }
    if(req.body.username) {
      await User.count({username: req.body.profile.username}, function (err, count) {
        countUsername = count;
      }, err => console.log(err));
    }
    console.log(req.body.name + ' us ' + countUsername + ' ph ' + countPhone + ' em ' + countEmail)
    if (countUsername === 0 && countPhone === 0 && countEmail === 0) {
      const update = {
        surname: req.body.profile.surname,
        name: req.body.profile.name,
        email: req.body.profile.email,
        birthdate: req.body.profile.birthdate,
        username: req.body.profile.username,
        phone_num: req.body.profile.phone_num
      }

      User.findOneAndUpdate({_id: req.body.id}, update, function (err, user) {

        if (!user) {

          res.status(403).json({success: false, msg: 'L\'utente non esiste' })

        } else {

          res.status(200).json({success: true, user: user});

        }

      })
    }else{
      res.status(403).send({
        success: false,
        msg: 'I dati inseriti non sono accettabili',
        email: countEmail,
        phone: countPhone,
        username: countUsername
      })
    }
  } catch (err) {

      console.log(err)
      res.status(500).json({
        type: "Si e\' verificato un errore",
        msg: err
      })

  }
}

module.exports.modifyPassword = function (req, res) {
  const update = {password: createHash('sha256').update(req.body.password).digest('base64')};

  try {

    User.findOneAndUpdate({_id: req.body.id}, update, function (err, user) {

      if (!user) {

        res.status(403).json({success: false, msg: 'L\'utente non esiste'})

      } else {

        res.status(200).json({success: true, user: user});

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

module.exports.register = async function (req, res) {
  let countEmail = 0;
  let countUsername = 0;
  let countPhone = 0;

  try {
    await User.count({email: req.body.email}, function (err, count) {
      countEmail = count;
    }, err => console.log(err));

    await User.count({phone_num: req.body.phone_num}, function (err, count) {
      countPhone = count;

    }, err => console.log(err));
    await User.count({username: req.body.username}, function (err, count) {
      countUsername = count;

    }, err => console.log(err));

    console.log(req.body.name + ' us ' + countUsername + ' ph ' + countPhone + ' em ' + countEmail)
    if (countUsername === 0 && countPhone === 0 && countEmail === 0) {
      console.log("not already registered");
      let newUser;
      newUser = new User();
      newUser.name = req.body.name;
      newUser.surname = req.body.surname;
      newUser.phone_num = req.body.phone_num;
      newUser.birthdate = req.body.birthdate;
      newUser.email = req.body.email;
      newUser.admin = false;
      newUser.username = req.body.username;
      newUser.password = ' ';

      console.log(newUser.toString());
      await newUser.save(); //salvo il nuovo utente nel db
      res.status(200).json({
        success: true,
        msg: "L\'utente e\' stato creato",
        user: newUser
      })
      console.log("registered")
    } else {
      res.status(403).send({
        success: false,
        email: countEmail,
        phone: countPhone,
        username: countUsername
      })
    }
  } catch (err) {

    console.log(err)
    res.status(500).json({
      type: "Si e\' verificato un errore",
      msg: err
    })

  }
}

module.exports.deleteUser = function (req, res) {
  console.log('deleting user');
  let id = mongoose.Types.ObjectId(req.param("_id"));

  try {

    User.findByIdAndDelete(id, function (err, user) {

      if (!user) {

        res.status(403).json({success: false, msg: 'L\'utente non esiste'})

      } else {

        res.status(200).json({
          success: true,
          msg: "Utente cancellato"
        })

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

module.exports.getUser = function (req, res) {
  console.log('Get user controller parameter ' + req.param("_id"));
  let id = mongoose.Types.ObjectId(req.param("_id"));

  try {

    User.findOne({_id: id}, (err, user) => {

      if (!user) {

        res.status(403).json(user);
        console.log("User not found!");

      } else {
        console.log("User found");
        res.status(200).json({
          success: true,
          userFound: user
        })
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


module.exports.searchUser = function (req, res) {
  console.log("Search suggestion user " + req.param("name"))

  User.find({name: new RegExp(req.param("name"), "i")},
    function (err, users) {
      if (err) {
        console.log('Error occurred');
        res.status(500).json({
          type: "Si e\' verificato un errore",
          msg: err
        })
      } else {
        console.log("Users found in suggestion");
        res.json(users)
        console.log(users)
      }
    })
}

