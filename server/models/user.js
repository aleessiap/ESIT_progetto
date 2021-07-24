const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    numCell: {type: Number, required: true},
    admin:{type:Boolean},
    password:{type:String, required:true},
    name: {type:String, required:true},
    surname:{type:String, required:true},
    email:{type:String, unique:true, required:true},
    birthdate:{type:Date, required:true, default: Date.now }
  }
);

module.exports = mongoose.model('Users', userSchema);
