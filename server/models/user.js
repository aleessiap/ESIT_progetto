const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(

  {

    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone_num: { type: String, required: true },
    birthdate: { type: Date, required: true, default: Date.now },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true },

  }

);

module.exports = mongoose.model('User', userSchema, 'User');
