const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const conf = require('../config');
const usersRoutes = require('./routes/users');
const app = express();
const port = process.env.PORT || 8080;

db  = mongoose.connect(conf.DB, {useNewUrlParser:true , useUnifiedTopology: true})
  .then(() => {console.log("Connected to the database!");})
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api", usersRoutes);
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ESIT application." });
});

app.listen(port, function(){
  console.log("Node Js Server is Running");
})
module.exports.server = app;
