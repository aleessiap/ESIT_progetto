const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const conf = require('../config');
const session = require('express-session');
const usersRoutes = require('./routes/user');
const doorsRoutes = require('./routes/door');
const accessRoutes = require('./routes/access');
const authorizationRoutes = require('./routes/authorization');
const {generateRandomPassword} = require('./passwd');
const {ALL_CHARS} = require('./passwd');
//const bot = require('./bot-telegram')
const device = require('./aws-iot')
const app = express();
const port = process.env.PORT || conf.PORT;

app.use(session({
  secret: generateRandomPassword(128, ALL_CHARS), // random unique string key used to authenticate a session
  expires: 30 * 60 * 1000,
  cookie: { }
}))

db = mongoose.connect('mongodb://localhost:27017/ESIT-Testing', {useNewUrlParser:true , useUnifiedTopology: true})
  .then(() => {console.log("Connected to the database of testing!");})
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api/users", usersRoutes);
app.use("/api/doors", doorsRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/auths", authorizationRoutes);

app.use(cors());

app.listen(port, function(){
  console.log("Server is Running with ip: ", conf.HOST_IP, ":", port);
})


device.listen_device(app, bot)
module.exports.server = app;
