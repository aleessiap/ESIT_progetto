const User = require('../models/user')


//per login
module.exports.login = function(req, res){
  const userEmail = req.body.username;
  const pass = req.body.password;
  User.findOne({email: userEmail}, function (err, foundUser) {
    if (foundUser) {

      if(pass == foundUser.password){
        res.json(foundUser);
        console.log("User found" );

        return foundUser;
      }else{
        console.log("Password errata");
      }
    } else {
      console.log("User not found" );
      res.json(err);
    }

    return err;
  })
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


//per registrare un nuovo utente
module.exports.register = function(req, res){
  console.log("Register controller");
  if (!req.body.email) {
    res.status(400).send({ message: "Content must have email!" });
    return;
  }

  //creo nuovo utente e popolo con i dati passati
  let newUser;
  newUser= new User();
  newUser.name= req.body.name;
  newUser.surname = req.body.surname;
  newUser.phone_num= req.body.phone_num;
  newUser.birthdate=req.body.birthdate;
  newUser.email=req.body.email;
  newUser.admin = false;
  newUser.password = 'password'; //per ora sto mettendo una password fissa poi sarà cambiata con una random
  console.log(newUser.toString());

  newUser.save().then(r => console.log('Saved')); //salvo il nuovo utente nel db
  return newUser;
}
