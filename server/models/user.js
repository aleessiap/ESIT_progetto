const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(

  {

    name: { type: String, required: true },
    surname: { type: String, required: true },
    birthdate: { type: Date, required: true, default: Date.now },

    chat_id: {  unique: true, type: String },
    username: { unique: true, type: String, required: true },
    phone_num: { unique: true,  type: String, required: true },
    email: {  unique: true, type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true },
    door_list: { type: [{type: mongoose.SchemaTypes.ObjectId}], required: true }

  }

);

module.exports = mongoose.model('User', userSchema, 'User');
