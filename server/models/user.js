const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(

  {

    name: { type: String, required: true },
    surname: { type: String, required: true },
    birthdate: { type: Date,  default: Date.now, required: true },

    chat_id: { type: String },
    username: { unique: true, type: String, required: true },
    phone_num: { unique: true,  type: String, required: true },
    email: {  unique: true, type: String, required: true},
    password: { default: '', type: String, required: true },
    admin: { type: Boolean, required: true },
    door_list: { type: [{type: mongoose.SchemaTypes.ObjectId}], required: true }

  }

);

module.exports = mongoose.model('User', userSchema, 'User');
