const User = require('../models/user')


//per login
module.exports.login = function(req, res){
  const credential = {
    email: req.body.username,
    password: req.body.password
  }

  try{
    User.findOne({email: credential.email},function (err, user)  {

      if (!user){
        console.log("User not found");
        res.status(400).json({
          type: "Not Found",
          msg: "Wrong Login Credentials"
        })
      }
      else{
        console.log("USER: " + user);
        if(credential.password == user.password){
          console.log("User found");
          res.status(200).json({
            success: true,
            userFound: user
          })
        }else{
          console.log("Wrong password");
          res.status(400).json({
            type: "Not Found",
            msg: "Wrong Password"
          })
        }
      }

    })
  }
  catch(err){
    console.log(err)
    res.status(500).json({
      type: "An error accurred",
      msg: err
    })
  }

}

//Per trovare tutti gli utenti
module.exports.getUsers = function(req, res){
  User.find((error, data) => {
    if (error) {
      console.log(error.message);
    } else {
      res.json(data);
    }
  })
}

module.exports.modifyProfile = function(req,res){
  console.log(req);
  var update = {
    surname : req.body.profile.surname,
    name: req.body.profile.name,
    email: req.body.profile.email,
    birthdate: req.body.profile.birthdate,
    username: req.body.profile.username,
    phone_num: req.body.profile.phone_num
  }
  User.findOneAndUpdate({_id: req.body.currentUser._id}, update,function(err){
    if(err){
      console.log(err.message);
    }else{
      console.log('Ok');
    }
  })
}

//per registrare un nuovo utente
module.exports.register = function(req, res){
  try {
    User.count({email: req.body.email}, function (err, count) {
      if (count > 0) {
        console.log('User already registered');
        res.status(400).send({message: "User already registered"});
        return;
      }
    });


    //creo nuovo utente e popolo con i dati passati
    let newUser;
    newUser = new User();
    newUser.name = req.body.name;
    newUser.surname = req.body.surname;
    newUser.phone_num = req.body.phone_num;
    newUser.birthdate = req.body.birthdate;
    newUser.email = req.body.email;
    newUser.admin = false;
    newUser.username = req.body.username;
    newUser.password = 'password'; //per ora sto mettendo una password fissa poi sarà cambiata con una random
    console.log(newUser.toString());
    let savedUser = newUser.save(); //salvo il nuovo utente nel db
    res.status(200).json({
      msg: "New user has been created",
      data: savedUser
    })
  }
  catch(err){
    console.log(err)
    res.status(500).json({
      error:err
    })
  }
}
